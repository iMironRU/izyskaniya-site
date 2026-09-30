'use client';

import { Check, Download, Pencil, Send, Share2 } from 'lucide-react';
import { AssumptionBadge } from '@/components/Assumption/Assumption';
import { Button } from '@/components/Button/Button';
import { DataTable } from '@/components/DataTable/DataTable';
import { NormRef } from '@/components/NormRef/NormRef';
import { Notice } from '@/components/Notice/Notice';
import { PriceTag } from '@/components/PriceTag/PriceTag';
import type { CalcData, Program, ProgramItem, ServiceId } from '@/engine/schema';
import { formatMoney, formatNumber } from '@/lib/format';
import { rangeReasonText } from './texts';

export interface ResultProps {
  data: CalcData;
  program: Program;
  onEdit: (questionId: string) => void;
  onPdf: () => void;
  onShare: () => void;
  onSend: () => void;
  pdfBusy?: boolean;
  shareState?: 'idle' | 'copied' | 'error';
  /** Ссылка для ручного копирования, если буфер обмена недоступен */
  sharedUrl?: string;
  /** Ссылка открыта с устаревшей версией цен */
  pricesChanged?: boolean;
}


const formatQty = (i: ProgramItem) => `${formatNumber(i.qty)} ${i.unit}`;

export function Result({ data, program: p, onEdit, onPdf, onShare, onSend, pdfBusy, shareState = 'idle', sharedUrl, pricesChanged }: ResultProps) {
  const title = (s: ServiceId) => data.services.find((x) => x.service === s)?.title ?? s;
  const questionTitle = (id: string) => data.questions.find((q) => q.id === id)?.title ?? id;
  const answerLabel = (id: string, v: unknown) => {
    const q = data.questions.find((x) => x.id === id);
    if (Array.isArray(v)) return v.map((x) => q?.options?.find((o) => o.value === x)?.label ?? x).join(', ');
    if (typeof v === 'boolean') return v ? 'да' : 'нет';
    const opt = q?.options?.find((o) => o.value === String(v));
    return opt ? opt.label : `${formatNumber(Number(v))} ${q?.number?.unit ?? ''}`.trim();
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <p className="m-0 font-code text-xs tracking-wide text-text-accent uppercase">Предварительная программа работ</p>
        <h1 className="m-0 font-display text-3xl leading-tight font-bold">{p.services.map(title).join(' и ')}</h1>
        <div className="flex flex-col gap-2 border-t border-b border-border-strong py-4">
          {p.price.kind === 'exact' ? (
            <PriceTag kind="exact" total={p.price.total} size="lg" note="Без НДС. Предварительный расчёт." />
          ) : (
            <PriceTag kind="range" min={p.price.min} max={p.price.max} size="lg" note="Без НДС. Предварительный расчёт." />
          )}
          {p.range_reasons.map((r) => (
            <p key={r} className="m-0 text-md leading-normal text-text-secondary">
              {rangeReasonText[r]}
            </p>
          ))}
          <p className="m-0 text-md">
            Срок: <span className="font-semibold tabular-nums">{p.duration_days.min === p.duration_days.max ? p.duration_days.min : `${p.duration_days.min}–${p.duration_days.max}`} дней</span>
            {p.urgency.multiplier !== 1 ? ` (${p.urgency.title.toLowerCase()})` : null}
          </p>
        </div>
      </header>

      {pricesChanged ? <Notice tone="info" title="Цены обновились">Расчёт по ссылке пересчитан по действующим ценам.</Notice> : null}
      {p.has_demo_values || p.has_unverified_rules ? (
        <Notice tone="info" title="Демонстрационный расчёт">
          Цены и правила объёма пока демонстрационные и не проверены инженером. Не используйте эти цифры для договора.
        </Notice>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row">
        <Button onClick={onPdf} loading={pdfBusy} block>
          <Download className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Скачать PDF
        </Button>
        <Button variant="secondary" onClick={onShare} block>
          {shareState === 'copied' ? <Check className="size-5" strokeWidth={1.75} aria-hidden="true" /> : <Share2 className="size-5" strokeWidth={1.75} aria-hidden="true" />}
          {shareState === 'copied' ? 'Ссылка скопирована' : 'Поделиться'}
        </Button>
        <Button variant="secondary" onClick={onSend} block>
          <Send className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Отправить инженеру
        </Button>
      </div>
      {shareState === 'error' ? (
        <Notice tone="info" title="Скопируйте ссылку">
          <input
            readOnly
            value={sharedUrl}
            aria-label="Ссылка на расчёт"
            onFocus={(e) => e.currentTarget.select()}
            className="h-field-height w-full border border-field-border bg-field-bg px-3 font-code text-sm"
          />
        </Notice>
      ) : null}

      {p.quantities.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-xl font-semibold">Объём и почему он такой</h2>
          <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
            {p.quantities.map((q) => (
              <li key={q.id} className="flex flex-col gap-2 border-b border-border-default py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{q.title}</span>
                  <span className="font-code text-lg tabular-nums">
                    {formatNumber(q.value)} {q.unit}
                  </span>
                </div>
                <p className="m-0 text-md leading-normal text-text-secondary">{q.basis}</p>
                {q.norm ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <NormRef code={q.norm.code} clause={q.verified ? q.norm.clause : undefined} />
                    {!q.verified ? <span className="text-sm text-text-secondary">требует проверки инженером</span> : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.services.map((s) => (
        <section key={s} className="flex flex-col gap-3">
          <h2 className="m-0 text-xl font-semibold">{title(s)}: состав работ</h2>
          <DataTable<ProgramItem>
            caption={`${title(s)}: состав работ`}
            captionHidden
            rows={p.items.filter((i) => i.service === s)}
            rowKey={(i) => i.rule}
            columns={[
              {
                key: 'title',
                header: 'Работа',
                primary: true,
                cell: (i) => (
                  <span className="flex flex-col gap-1">
                    <span>{i.title}</span>
                    <span className="text-sm font-regular text-text-secondary">{i.basis}</span>
                  </span>
                ),
              },
              { key: 'norm', header: 'Норматив', cell: (i) => (i.norm ? <NormRef code={i.norm.code} clause={i.verified ? i.norm.clause : undefined} /> : '—') },
              { key: 'qty', header: 'Объём', cell: formatQty, align: 'end' },
              { key: 'total', header: 'Стоимость', cell: (i) => formatMoney(i.total), align: 'end' },
            ]}
          />
        </section>
      ))}

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-xl font-semibold">Как сложилась цена</h2>
        <dl className="m-0 flex flex-col border-t border-border-strong">
          <Row term="Работы" value={formatMoney(p.subtotal)} />
          {p.bundle_discount ? <Row term={`Скидка за геологию и топосъёмку вместе, ${p.bundle_discount.percent} %`} value={`−${formatMoney(p.bundle_discount.amount)}`} /> : null}
          {p.urgency.multiplier !== 1 ? <Row term={`${p.urgency.title}`} value={`×${formatNumber(p.urgency.multiplier)}`} /> : null}
          <Row term={`Выезд, ${p.travel.title}`} value={p.travel.price === null ? 'по согласованию' : formatMoney(p.travel.price)} />
        </dl>
      </section>

      {p.assumptions.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-xl font-semibold">Что мы приняли за вас</h2>
          <p className="m-0 text-md leading-normal text-text-secondary">На эти вопросы вы ответили «Не знаю». Если уточните — расчёт станет точнее.</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {p.assumptions.map((a) => (
              <li key={a.question} className="flex flex-col items-start gap-2 border border-assumption-border bg-assumption-bg p-3">
                <AssumptionBadge />
                <span className="font-semibold">
                  {questionTitle(a.question)} — {answerLabel(a.question, a.assumed)}
                </span>
                <span className="text-md leading-normal">{a.note}</span>
                <Button variant="text" onClick={() => onEdit(a.question)}>
                  <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  Уточнить
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.client_checklist.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-xl font-semibold">Что подготовить</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {p.client_checklist.map((c) => (
              <li key={c} className="flex gap-3 text-md leading-normal">
                <Check className="mt-1 size-4 shrink-0 text-text-accent" strokeWidth={2} aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border-default py-2">
      <dt className="text-md">{term}</dt>
      <dd className="m-0 text-md font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
