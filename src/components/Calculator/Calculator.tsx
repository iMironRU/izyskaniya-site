'use client';

import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button/Button';
import { Notice } from '@/components/Notice/Notice';
import { QuizProgress } from '@/components/QuizProgress/QuizProgress';
import { calculate } from '@/engine/calculate';
import type { Answers, CalcData, Program } from '@/engine/schema';
import { decodeShare, encodeShare } from '@/engine/share';
import type { LatLng } from '@/lib/geo';
import type { LeadSender } from '@/lead/types';
import type { Company } from '@/site/schema';
import { LeadForm } from './LeadForm';
import { QuestionStep } from './QuestionStep';
import { Result } from './Result';
import { fromDraft, pruneAnswers, toDraft, visibleQuestions, type Draft } from './quiz';
import { sectionTitle } from './texts';

export interface CalculatorProps {
  data: CalcData;
  company: Company;
  sender: LeadSender;
  homeHref: string;
  privacyHref: string;
  /** basePath сайта для шрифтов PDF */
  base: string;
  /** Ответы-пресеты сценария с главной (?s=…) */
  presets?: Record<string, Answers>;
}

type Step = number | 'result';
const STORAGE_KEY = 'calculator-draft-v1';

interface Init {
  answers: Answers;
  step: Step;
  pricesChanged: boolean;
}

/** Старт: ссылка «Поделиться» → результат; иначе черновик из этой вкладки; иначе пресет сценария. */
function initialState(version: string, presets: Record<string, Answers>): Init {
  const params = new URLSearchParams(window.location.search);
  const r = params.get('r');
  const shared = r ? decodeShare(r) : null;
  if (shared) return { answers: shared.answers, step: 'result', pricesChanged: shared.pricingVersion !== version };
  const saved = readStorage();
  if (saved) return { ...saved, pricesChanged: false };
  const s = params.get('s');
  return { answers: (s && presets[s]) || {}, step: 0, pricesChanged: false };
}

function readStorage(): { answers: Answers; step: Step } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function Calculator({ data, company, sender, homeHref, privacyHref, base, presets = {} }: CalculatorProps) {
  // Компонент рендерится только в браузере (см. CalculatorClient), поэтому window доступен сразу.
  const [init] = useState(() => initialState(data.pricing.version, presets));
  const [answers, setAnswers] = useState<Answers>(init.answers);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [step, setStep] = useState<Step>(init.step);
  const [returnToResult, setReturnToResult] = useState(false);
  const [error, setError] = useState<string>();
  const [point, setPoint] = useState<LatLng | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [sharedUrl, setSharedUrl] = useState('');
  const pricesChanged = init.pricesChanged;
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const visible = useMemo(() => visibleQuestions(data.questions, answers), [data.questions, answers]);
  const pruned = useMemo(() => pruneAnswers(data.questions, answers), [data.questions, answers]);

  // Черновик переживает перезагрузку вкладки.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* приватный режим — просто без черновика */
    }
  }, [answers, step]);

  // Шаг хранится в #hash адреса (#floors, #result): системная кнопка «назад» на телефоне
  // ведёт на предыдущий вопрос, а не со страницы. history.state не используем — его переписывает Next.
  const visibleRef = useRef(visible);
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const go = useCallback((next: Step, questionId?: string) => {
    setStep(next);
    setError(undefined);
    const hash = next === 'result' ? '#result' : `#${questionId ?? visibleRef.current[next]?.id ?? ''}`;
    // Ушли с результата — ссылка ?r= больше не описывает ответы, убираем её из адреса.
    const url = next === 'result' ? `${window.location.pathname}${window.location.search}${hash}` : `${window.location.pathname}${hash}`;
    window.history.pushState(window.history.state, '', url);
  }, []);

  useEffect(() => {
    const hash = init.step === 'result' ? '#result' : `#${visibleRef.current[init.step]?.id ?? ''}`;
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
    const onPop = () => {
      const id = window.location.hash.slice(1);
      const i = visibleRef.current.findIndex((q) => q.id === id);
      setStep(id === 'result' ? 'result' : Math.max(0, i));
      setError(undefined);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [init.step]);

  // Фокус на заголовок нового шага — для клавиатуры и скринридера.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  const program = useMemo<Program | Error | null>(() => {
    if (step !== 'result') return null;
    try {
      return calculate(data, pruned);
    } catch (e) {
      return e as Error;
    }
  }, [step, data, pruned]);

  const shareUrl = () => `${window.location.origin}${window.location.pathname}?r=${encodeShare(pruned, data.pricing.version)}`;

  if (step === 'result') {
    if (!program || program instanceof Error) {
      return (
        <div className="flex flex-col gap-4">
          <Notice tone="error" title="Не получилось открыть расчёт">
            Ссылка повреждена или устарела. Пройдите вопросы заново — это пара минут.
          </Notice>
          <Button
            onClick={() => {
              setAnswers({});
              go(0);
            }}
          >
            Начать заново
          </Button>
        </div>
      );
    }
    const onShare = async () => {
      const url = shareUrl();
      setSharedUrl(url);
      window.history.replaceState({ step: 'result' }, '', url);
      try {
        if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
          await navigator.share({ title: 'Предварительная программа работ', url });
        } else {
          await navigator.clipboard.writeText(url);
          setShareState('copied');
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setShareState('error');
      }
    };
    const onPdf = async () => {
      setPdfBusy(true);
      try {
        const { downloadProgramPdf } = await import('./pdf');
        await downloadProgramPdf({ data, program, company, shareUrl: shareUrl(), date: new Date(), base });
      } finally {
        setPdfBusy(false);
      }
    };
    return (
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => go(visible.length - 1)} />
        </div>
        <h2 ref={heading} tabIndex={-1} className="sr-only">
          Результат расчёта
        </h2>
        <Result
          data={data}
          program={program}
          pricesChanged={pricesChanged}
          pdfBusy={pdfBusy}
          shareState={shareState}
          sharedUrl={sharedUrl}
          onShare={onShare}
          onPdf={onPdf}
          onSend={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          onEdit={(id) => {
            const i = visible.findIndex((q) => q.id === id);
            if (i >= 0) {
              setReturnToResult(true);
              go(i);
            }
          }}
        />
        <div id="lead-form" className="scroll-mt-4 border-t border-border-strong pt-8">
          <LeadForm
            sender={sender}
            privacyHref={privacyHref}
            phone={company.phone}
            lead={{
              answers: pruned,
              cadastral: typeof answers.cadastral === 'string' ? answers.cadastral : undefined,
              point: point ?? undefined,
              price: program.price,
              pricing_version: data.pricing.version,
              share_url: shareUrl(),
            }}
          />
        </div>
      </div>
    );
  }

  const index = Math.min(step, visible.length - 1);
  const q = visible[index];
  const draft = q.id in drafts ? drafts[q.id] : toDraft(q, answers[q.id]);

  const next = (e: FormEvent) => {
    e.preventDefault();
    const r = fromDraft(q, draft);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const updated = { ...answers };
    if (r.value === undefined) delete updated[q.id];
    else updated[q.id] = r.value;
    setAnswers(updated);
    setDrafts((prev) => {
      const rest = { ...prev };
      delete rest[q.id];
      return rest;
    });
    const nextVisible = visibleQuestions(data.questions, updated);
    const atEnd = index + 1 >= nextVisible.length;
    if (returnToResult || atEnd) {
      setReturnToResult(false);
      go('result');
    } else go(index + 1, nextVisible[index + 1].id);
  };

  return (
    <form onSubmit={next} noValidate className="flex flex-col gap-6 pb-24">
      <div className="flex flex-col gap-4">
        {index === 0 ? (
          <a href={homeHref} className="-ml-3 flex min-h-11 items-center gap-2 self-start px-3 text-md font-medium text-text-primary no-underline">
            <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
            На главную
          </a>
        ) : (
          <BackButton onClick={() => go(index - 1)} />
        )}
        <QuizProgress current={index + 1} total={visible.length} section={sectionTitle[q.service]} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 ref={heading} tabIndex={-1} className="m-0 font-display text-3xl leading-tight font-bold outline-none">
          {q.title}
        </h1>
        {q.hint ? <p className="m-0 text-md leading-normal text-text-secondary">{q.hint}</p> : null}
      </div>
      <QuestionStep
        key={q.id}
        question={q}
        draft={draft}
        error={error}
        onDraft={(d) => {
          setDrafts((prev) => ({ ...prev, [q.id]: d }));
          setError(undefined);
        }}
        location={{ office: company.office, zoom: company.map.zoom, pricing: data.pricing, point, onPoint: setPoint }}
      />
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border-default bg-bg-page px-4 pt-3 pb-safe md:static md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto max-w-2xl">
          <Button type="submit" size="lg" block>
            {returnToResult ? 'К результату' : q.lead_only && !draft ? 'Пропустить' : index + 1 >= visible.length ? 'Показать результат' : 'Дальше'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="-ml-3 flex min-h-11 cursor-pointer items-center gap-2 self-start border-0 bg-transparent px-3 text-md font-medium text-text-primary">
      <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
      Назад
    </button>
  );
}
