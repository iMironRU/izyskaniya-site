'use client';

import { ChevronLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button/Button';
import { CalcProgress } from '@/components/CalcProgress/CalcProgress';
import { CallbackForm } from '@/components/CallbackForm/CallbackForm';
import { FormStatus } from '@/components/CallbackForm/FormStatus';
import { ContactSheet } from '@/components/ContactSheet/ContactSheet';
import { StickyBar } from '@/components/StickyBar/StickyBar';
import { resolveAnswers } from '@/engine/answers';
import { calculate } from '@/engine/calculate';
import type { Answers, CalcData, Program } from '@/engine/schema';
import { decodeShare, encodeShare } from '@/engine/share';
import type { LatLng } from '@/lib/geo';
import type { LeadSender } from '@/lead/types';
import type { SiteContacts } from '@/site/nav';
import type { Company } from '@/site/schema';
import { QuestionStep, WhyWeAsk } from './QuestionStep';
import { Result } from './Result';
import { Summary } from './Summary';
import { fromDraft, pruneAnswers, toDraft, visibleQuestions, type Draft } from './quiz';
import { programNumber } from './texts';

export interface CalculatorProps {
  data: CalcData;
  company: Company;
  contacts: SiteContacts;
  sender: LeadSender;
  homeHref: string;
  privacyHref: string;
  thanksHref: string;
  /** basePath сайта для шрифтов PDF */
  base: string;
}

type Step = number | 'result';
const STORAGE_KEY = 'calculator-draft-v2';

interface Init {
  answers: Answers;
  step: Step;
  pricesChanged: boolean;
}

function readStorage(): { answers: Answers; step: Step } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Старт: ссылка «Поделиться» → результат; сценарий ?s= → пресет ветки; иначе черновик вкладки. */
function initialState(data: CalcData): Init {
  const params = new URLSearchParams(window.location.search);
  const r = params.get('r');
  const shared = r ? decodeShare(r) : null;
  if (shared) return { answers: shared.answers, step: 'result', pricesChanged: shared.pricingVersion !== data.pricing.version };
  const s = params.get('s');
  const preset = s ? data.presets?.[s] : undefined;
  const saved = readStorage();
  if (preset) {
    const same = saved && saved.answers.branch === preset.answers.branch;
    return same ? { ...saved, pricesChanged: false } : { answers: { ...preset.answers }, step: 0, pricesChanged: false };
  }
  if (saved) return { ...saved, pricesChanged: false };
  return { answers: {}, step: 0, pricesChanged: false };
}

export function Calculator({ data, company, contacts, sender, homeHref, privacyHref, thanksHref, base }: CalculatorProps) {
  // Компонент рендерится только в браузере (CalculatorClient, ssr: false), поэтому window доступен сразу.
  const [init] = useState(() => initialState(data));
  const [answers, setAnswers] = useState<Answers>(init.answers);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [step, setStep] = useState<Step>(init.step);
  const [returnToResult, setReturnToResult] = useState(false);
  const [error, setError] = useState<string>();
  const [point, setPoint] = useState<LatLng | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [sharedUrl, setSharedUrl] = useState('');
  const [sheet, setSheet] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const resolved = useMemo(() => resolveAnswers(data.questions, answers), [data.questions, answers]);
  const visible = useMemo(() => visibleQuestions(data.questions, answers), [data.questions, answers]);
  const pruned = useMemo(() => pruneAnswers(data.questions, answers), [data.questions, answers]);
  const branch = data.questions.find((q) => q.id === 'branch')?.options?.find((o) => o.value === String(resolved.values.branch))?.label ?? 'Расчёт';

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* приватный режим — без черновика */
    }
  }, [answers, step]);

  // Шаг в #hash адреса (#floors, #result): системная «назад» на телефоне ведёт на предыдущий вопрос.
  const visibleRef = useRef(visible);
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const go = useCallback((next: Step, questionId?: string) => {
    setStep(next);
    setError(undefined);
    const hash = next === 'result' ? '#result' : `#${questionId ?? visibleRef.current[next]?.id ?? ''}`;
    // Ушли с результата — ссылка ?r= больше не описывает ответы: оставляем только сценарий ?s=.
    const search = next === 'result' ? window.location.search : window.location.search.replace(/[?&]r=[^&#]*/, '').replace(/^&/, '?');
    window.history.pushState(window.history.state, '', `${window.location.pathname}${search}${hash}`);
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

  const shareUrl = () => {
    const s = new URLSearchParams(window.location.search).get('s');
    return `${window.location.origin}${window.location.pathname}?${s ? `s=${s}&` : ''}r=${encodeShare(pruned, data.pricing.version)}#result`;
  };

  if (step === 'result') {
    if (!program || program instanceof Error) {
      return (
        <div className="flex max-w-measure flex-col gap-4">
          <FormStatus tone="error" title="Не получилось открыть расчёт">
            Ссылка повреждена или устарела. Пройдите вопросы заново — это пара минут.
          </FormStatus>
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
    const date = new Date();
    const number = programNumber(JSON.stringify(pruned));
    const onShare = async () => {
      const url = shareUrl();
      setSharedUrl(url);
      window.history.replaceState(window.history.state, '', url);
      try {
        if (navigator.share && window.matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Предварительная программа работ', url });
        else {
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
        await downloadProgramPdf({ data, program, company, shareUrl: shareUrl(), date, number, base });
      } finally {
        setPdfBusy(false);
      }
    };
    const canAddTopo = resolved.relevant.includes('need_topo') && !program.services.includes('topo');
    const range = program.price.kind === 'range';
    return (
      <>
        <div className="flex flex-col gap-6 pb-sticky-bar-height md:pb-0">
          <div>
            <Button variant="ghost" compact onClick={() => go(visible.length - 1)} iconStart={<ChevronLeft className="size-icon" strokeWidth={1.5} aria-hidden="true" />}>
              Изменить ответы
            </Button>
          </div>
          <h2 ref={heading} tabIndex={-1} className="sr-only">
            Результат расчёта
          </h2>
          <Result
            data={data}
            program={program}
            number={number}
            date={date}
            pricesChanged={init.pricesChanged && step === init.step}
            pdfBusy={pdfBusy}
            shareState={shareState}
            sharedUrl={sharedUrl}
            onShare={onShare}
            onPdf={onPdf}
            onSend={() => setSheet(true)}
            onAddTopo={canAddTopo ? () => setAnswers((a) => ({ ...a, need_topo: true })) : undefined}
            onEdit={(id) => {
              const i = visible.findIndex((q) => q.id === id);
              if (i >= 0) {
                setReturnToResult(true);
                go(i);
              }
            }}
          />
        </div>
        <StickyBar>
          <Button block className="flex-1" onClick={() => setSheet(true)}>
            {range ? 'Отправить ТЗ инженеру' : 'Отправить инженеру'}
          </Button>
        </StickyBar>
        {sheet ? (
          <ContactSheet title="Отправить инженеру" contacts={contacts} onClose={() => setSheet(false)}>
            <CallbackForm
              kind={range ? 'tz' : 'calc'}
              title={range ? 'Пришлите ТЗ — посчитаем точно' : 'Куда прислать расчёт'}
              sender={sender}
              privacyHref={privacyHref}
              thanksHref={thanksHref}
              phone={contacts.phone}
              calc={{
                answers: pruned,
                cadastral: typeof answers.cadastral === 'string' ? answers.cadastral : undefined,
                point: point ?? undefined,
                price: program.price,
                pricing_version: data.pricing.version,
                share_url: shareUrl(),
              }}
            />
          </ContactSheet>
        ) : null}
      </>
    );
  }

  const index = Math.min(step, visible.length - 1);
  const q = visible[index];
  const draft = q.id in drafts ? drafts[q.id] : toDraft(q, answers[q.id]);
  const embedded = data.questions.find((x) => x.embed === q.id && resolved.relevant.includes(x.id));

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
    if (returnToResult || index + 1 >= nextVisible.length) {
      setReturnToResult(false);
      go('result');
    } else go(index + 1, nextVisible[index + 1].id);
  };
  const back = () => (index === 0 ? window.location.assign(homeHref) : go(index - 1));
  const nextLabel = returnToResult ? 'К результату' : index + 1 >= visible.length ? 'Показать расчёт' : 'Далее';

  return (
    <form onSubmit={next} noValidate className="flex flex-col gap-8 pb-sticky-bar-height md:pb-0">
      <CalcProgress step={index + 1} total={visible.length} branch={branch} note="предварительная программа работ" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-3">
            <h1 ref={heading} tabIndex={-1} className="m-0 type-h2 outline-none">
              {q.title}
            </h1>
            <WhyWeAsk question={q} />
          </div>
          <QuestionStep
            key={q.id}
            question={q}
            draft={draft}
            error={error}
            values={resolved.values}
            onDraft={(d) => {
              setDrafts((prev) => ({ ...prev, [q.id]: d }));
              setError(undefined);
            }}
            location={{ office: company.office, zoom: company.map.zoom, pricing: data.pricing, point, onPoint: setPoint }}
            embedded={
              embedded
                ? { question: embedded, value: typeof answers[embedded.id] === 'string' ? (answers[embedded.id] as string) : '', onChange: (v) => setAnswers((a) => ({ ...a, [embedded.id]: v })) }
                : undefined
            }
          />
          <div className="hidden gap-3 md:flex">
            <Button variant="secondary" onClick={back} iconStart={<ChevronLeft className="size-icon" strokeWidth={1.5} aria-hidden="true" />}>
              Назад
            </Button>
            <Button type="submit" className="px-48">
              {nextLabel}
            </Button>
          </div>
        </div>
        <div className="hidden lg:block">
          <Summary steps={visible} answers={answers} cadastral={typeof answers.cadastral === 'string' ? answers.cadastral : undefined} />
        </div>
      </div>
      <StickyBar>
        <Button variant="secondary" onClick={back} className="flex-1">
          Назад
        </Button>
        <Button type="submit" className="flex-2">
          {nextLabel}
        </Button>
      </StickyBar>
    </form>
  );
}
