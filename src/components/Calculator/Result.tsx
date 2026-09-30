'use client';

import { Download, Pencil, Share2 } from 'lucide-react';
import { BoreholeScheme } from '@/components/Borehole/BoreholeScheme';
import { Button } from '@/components/Button/Button';
import { FormStatus } from '@/components/CallbackForm/FormStatus';
import { AssumptionBadge, FactFigure, Kicker, NormLink } from '@/components/Primitives/Primitives';
import { Table } from '@/components/Table/Table';
import { parseDims } from '@/engine/dims';
import type { CalcData, Program, ProgramItem, ServiceId } from '@/engine/schema';
import { formatMoney, formatNumber } from '@/lib/format';
import { answerText } from './quiz';
import { rangeReasonText, serviceShort } from './texts';

export interface ResultProps {
  data: CalcData;
  program: Program;
  number: string;
  date: Date;
  onEdit: (questionId: string) => void;
  onPdf: () => void;
  onShare: () => void;
  onSend: () => void;
  /** Предложить добавить топосъёмку пакетом (ветка «дом» без неё) */
  onAddTopo?: () => void;
  pdfBusy?: boolean;
  shareState?: 'idle' | 'copied' | 'error';
  sharedUrl?: string;
  pricesChanged?: boolean;
}

const q = (p: Program, id: string) => p.quantities.find((x) => x.id === id);

/** components/calc-result.md — предварительная программа работ. */
export function Result({ data, program: p, number, date, onEdit, onPdf, onShare, onSend, onAddTopo, pdfBusy, shareState = 'idle', sharedUrl, pricesChanged }: ResultProps) {
  const title = p.services.length === 2 ? 'Геология и топосъёмка' : p.services[0] === 'topo' ? 'Топосъёмка' : 'Инженерная геология';
  const bh = q(p, 'boreholes');
  const depth = q(p, 'depth_m');
  const drill = q(p, 'drilling_m');
  const dims = parseDims(p.answers.dims ?? p.assumptions.find((a) => a.question === 'dims')?.assumed);
  const norms = [...new Map([...p.quantities, ...p.items].filter((x) => x.norm).map((x) => [x.norm!.code, x.norm!])).values()].slice(0, 3);
  const bySvc = (s: ServiceId) => p.items.filter((i) => i.service === s).reduce((sum, i) => sum + i.total, 0);
  const priceText = p.price.kind === 'exact' ? formatMoney(p.price.total) : `${formatMoney(p.price.min)} — ${formatMoney(p.price.max)}`;
  const qById = (id: string) => data.questions.find((x) => x.id === id);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-8 lg:col-span-2">
        <header className="flex flex-col gap-3 border-b border-border-strong pb-6">
          <Kicker>
            Предварительная программа работ · № {number}
          </Kicker>
          <h1 className="m-0 type-display">{title}</h1>
        </header>

        {pricesChanged ? <FormStatus tone="info" title="Цены обновились">Расчёт по ссылке пересчитан по действующим ценам.</FormStatus> : null}
        {p.has_demo_values || p.has_unverified_rules ? (
          <FormStatus tone="info" title="Демонстрационный расчёт">
            Цены и правила объёма пока демонстрационные и не проверены инженером. Не используйте эти цифры для договора.
          </FormStatus>
        ) : null}

        {bh && depth && drill ? (
          <section aria-labelledby="why" className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 id="why" className="m-0 type-h3">
                Сколько скважин и почему
              </h2>
              <div className="flex flex-wrap gap-6">
                <FactFigure value={formatNumber(bh.value)} label={bh.value === 1 ? 'скважина' : bh.value < 5 ? 'скважины' : 'скважин'} />
                <FactFigure value={`${formatNumber(depth.value)} м`} label="глубина каждой" />
                <FactFigure value={`${formatNumber(drill.value)} м`} label="бурения всего" />
              </div>
              <p className="m-0 type-body text-justify hyphens-auto text-text-secondary">
                {dims ? `Для пятна ${formatNumber(dims.length)} × ${formatNumber(dims.width)} м (${formatNumber(Math.round(dims.length * dims.width))} м²) — ${formatNumber(bh.value)} скв. ` : null}
                {bh.basis} {depth.basis}
              </p>
              <div className="flex flex-wrap gap-2">
                {norms.map((n) => (
                  <NormLink key={n.code} code={n.code} />
                ))}
              </div>
              {!bh.verified || !depth.verified ? <p className="m-0 type-small text-text-muted">Правила объёма требуют проверки инженером.</p> : null}
            </div>
            {dims ? (
              <div className="rounded-md border border-border-default p-4">
                <BoreholeScheme length={dims.length} width={dims.width} count={bh.value} />
              </div>
            ) : null}
          </section>
        ) : null}

        <section aria-labelledby="works" className="flex flex-col gap-3">
          <h2 id="works" className="m-0 type-h3">
            Состав работ
          </h2>
          <Table<ProgramItem>
            caption="Состав работ"
            captionHidden
            rows={p.items}
            rowKey={(i) => `${i.service}-${i.rule}`}
            collapseAfter={p.items.length}
            columns={[
              { key: 'title', header: 'Работа', primary: true, cell: (i) => i.title },
              { key: 'qty', header: 'Объём', cell: (i) => `${formatNumber(i.qty)} ${i.unit}` },
              { key: 'norm', header: 'Норматив', cell: (i) => (i.norm ? <NormLink code={i.norm.code} small /> : '—') },
              { key: 'total', header: 'Стоимость', align: 'end', cell: (i) => formatMoney(i.total) },
            ]}
          />
        </section>

        {p.assumptions.length ? (
          <section aria-labelledby="assumptions" className="flex flex-col gap-3">
            <h2 id="assumptions" className="m-0 type-h3">
              Допущения
            </h2>
            <dl className="m-0 border-t border-border-strong">
              {p.assumptions.map((a) => {
                const qq = qById(a.question);
                return (
                  <div key={a.question} className="flex flex-col gap-2 border-b border-border-default py-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                      <dt className="type-small text-text-muted">{qq?.summary ?? a.title}</dt>
                      <dd className="m-0 flex flex-wrap items-center gap-2 type-body">
                        {qq ? answerText(qq, a.assumed) : String(a.assumed)} <AssumptionBadge />
                      </dd>
                      <dd className="m-0 type-small text-text-muted">{a.note}</dd>
                    </div>
                    <Button variant="ghost" compact onClick={() => onEdit(a.question)} iconStart={<Pencil className="size-16" strokeWidth={1.5} aria-hidden="true" />}>
                      Уточнить
                    </Button>
                  </div>
                );
              })}
            </dl>
          </section>
        ) : null}

        {p.client_checklist.length ? (
          <section aria-labelledby="checklist" className="flex flex-col gap-3">
            <h2 id="checklist" className="m-0 type-h3">
              {p.price.kind === 'range' ? 'Исходные данные для точной цены' : 'Что подготовить'}
            </h2>
            <ol className="m-0 flex list-none flex-col border-t border-border-strong p-0">
              {p.client_checklist.map((c, i) => (
                <li key={c} className="flex gap-4 border-b border-border-default py-2 type-body">
                  <span className="font-heading text-18 text-text-accent nums">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      <aside aria-label="Предварительная стоимость" className="lg:sticky lg:top-header-height lg:self-start">
        <div className="flex flex-col gap-4 rounded-card border border-card-border p-6">
          <p className="m-0 type-kicker text-text-muted">Предварительная стоимость</p>
          <p className="m-0 type-figure">{priceText}</p>
          {p.range_reasons.map((r) => (
            <p key={r} className="m-0 type-small text-text-secondary">
              {rangeReasonText[r]}
            </p>
          ))}
          <dl className="m-0 border-t border-border-default">
            {p.services.map((s) => (
              <Line key={s} term={serviceShort[s]} value={formatMoney(bySvc(s))} />
            ))}
            {p.bundle_discount ? <Line term={`Скидка за пакет, ${p.bundle_discount.percent} %`} value={`−${formatMoney(p.bundle_discount.amount)}`} /> : null}
            {p.urgency.multiplier !== 1 ? <Line term={p.urgency.title} value={`×${formatNumber(p.urgency.multiplier)}`} /> : null}
            <Line term={`Выезд, ${p.travel.title}`} value={p.travel.price === null ? 'по согласованию' : p.travel.price === 0 ? 'бесплатно' : formatMoney(p.travel.price)} />
            <Line term="Срок" value={`${p.duration_days.min === p.duration_days.max ? p.duration_days.min : `${p.duration_days.min}–${p.duration_days.max}`} рабочих дней`} />
          </dl>
          {onAddTopo ? (
            <Button variant="secondary" block onClick={onAddTopo}>
              + Топосъёмка со скидкой {data.pricing.bundle_discount.percent} %
            </Button>
          ) : null}
          <Button block onClick={onSend}>
            {p.price.kind === 'range' ? 'Отправить ТЗ инженеру' : 'Отправить инженеру'}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onPdf} loading={pdfBusy} iconStart={<Download className="size-16" strokeWidth={1.5} aria-hidden="true" />}>
              PDF
            </Button>
            <Button variant="secondary" onClick={onShare} iconStart={<Share2 className="size-16" strokeWidth={1.5} aria-hidden="true" />}>
              {shareState === 'copied' ? 'Скопировано' : 'Поделиться'}
            </Button>
          </div>
          {shareState === 'error' && sharedUrl ? (
            <label className="flex flex-col gap-1 type-small text-text-muted">
              Скопируйте ссылку
              <input readOnly value={sharedUrl} onFocus={(e) => e.currentTarget.select()} className="min-h-tap w-full rounded-input border border-input-border bg-transparent px-2 type-small" />
            </label>
          ) : null}
          <p className="m-0 type-small text-text-muted">
            Предварительный расчёт на {date.toLocaleDateString('ru-RU')}. Без НДС. Окончательный объём задаёт программа работ после выезда инженера.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Line({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border-default py-2 type-small">
      <dt className="text-text-secondary">{term}</dt>
      <dd className="m-0 text-right nums">{value}</dd>
    </div>
  );
}
