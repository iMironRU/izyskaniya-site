// PDF «Предварительная программа работ» (A4). Грузится лениво по кнопке — в основной бандл не попадает.
// Цвета — из TS-констант токенов, шрифты — полные woff из public/fonts/pdf (см. scripts/copy-pdf-fonts.mjs).
// В PDF заголовки набраны IBM Plex Sans: полного файла PT Serif с кириллицей в npm нет.
import { Document, Font, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import {
  colorAccentDefault,
  colorAssumptionBg,
  colorAssumptionBorder,
  colorBorderDefault,
  colorBorderStrong,
  colorTextPrimary,
  colorTextSecondary,
  colorTextInverse,
} from '@tokens';
import type { CalcData, Program, ServiceId } from '@/engine/schema';
import type { Company } from '@/site/schema';
import { formatMoney, formatNumber } from '@/lib/format';
import { rangeReasonText } from './texts';

let fontsReady = false;
export function registerFonts(base: string) {
  if (fontsReady) return;
  Font.register({
    family: 'Plex Sans',
    fonts: [
      { src: `${base}/fonts/pdf/IBMPlexSans-Regular.woff` },
      { src: `${base}/fonts/pdf/IBMPlexSans-SemiBold.woff`, fontWeight: 600 },
      { src: `${base}/fonts/pdf/IBMPlexSans-Bold.woff`, fontWeight: 700 },
    ],
  });
  Font.register({ family: 'Plex Mono', src: `${base}/fonts/pdf/IBMPlexMono-Regular.woff` });
  // Не переносить слова по слогам.
  Font.registerHyphenationCallback((w) => [w]);
  fontsReady = true;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Plex Sans', fontSize: 9.5, color: colorTextPrimary, paddingTop: 36, paddingBottom: 48, paddingHorizontal: 40 },
  head: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1.5, borderBottomColor: colorBorderStrong, paddingBottom: 8, marginBottom: 14 },
  company: { fontSize: 10, fontWeight: 600 },
  muted: { color: colorTextSecondary },
  kicker: { fontFamily: 'Plex Mono', fontSize: 7.5, color: colorAccentDefault, textTransform: 'uppercase', marginBottom: 3 },
  h1: { fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 },
  h2: { fontSize: 11.5, fontWeight: 600, lineHeight: 1.2, marginTop: 14, marginBottom: 6 },
  price: { fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 3 },
  box: { borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: colorBorderStrong, paddingVertical: 8, marginBottom: 6 },
  demo: { backgroundColor: colorTextPrimary, color: colorTextInverse, padding: 6, marginBottom: 10, fontSize: 8.5 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colorBorderDefault, paddingVertical: 4 },
  th: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colorBorderStrong, paddingVertical: 3, fontWeight: 600, fontSize: 8.5 },
  cWork: { flex: 5, paddingRight: 6 },
  cNorm: { flex: 2.4, paddingRight: 6 },
  cQty: { flex: 1.4, textAlign: 'right', paddingRight: 6 },
  cSum: { flex: 1.6, textAlign: 'right' },
  norm: { fontFamily: 'Plex Mono', fontSize: 7.5 },
  basis: { fontSize: 8, color: colorTextSecondary, marginTop: 1 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: colorBorderDefault, paddingVertical: 3 },
  badge: { fontFamily: 'Plex Mono', fontSize: 6.5, color: colorTextInverse, backgroundColor: colorAccentDefault, paddingHorizontal: 3, paddingVertical: 1, marginRight: 4 },
  assumption: { backgroundColor: colorAssumptionBg, borderWidth: 0.5, borderColor: colorAssumptionBorder, padding: 5, marginBottom: 4 },
  footerLeft: { position: 'absolute', bottom: 22, left: 40, right: 90, fontSize: 7.5, color: colorTextSecondary },
  footerRight: { position: 'absolute', bottom: 22, left: 40, right: 40, fontSize: 7.5, color: colorTextSecondary, textAlign: 'right' },
});

interface PdfProps {
  data: CalcData;
  program: Program;
  company: Company;
  shareUrl: string;
  date: Date;
}

export function ProgramPdf({ data, program: p, company, shareUrl, date }: PdfProps) {
  const title = (sv: ServiceId) => data.services.find((x) => x.service === sv)?.title ?? sv;
  const q = (id: string) => data.questions.find((x) => x.id === id);
  const label = (id: string, v: unknown) => {
    const qq = q(id);
    if (Array.isArray(v)) return v.map((x) => qq?.options?.find((o) => o.value === x)?.label ?? x).join(', ');
    if (typeof v === 'boolean') return v ? 'да' : 'нет';
    const opt = qq?.options?.find((o) => o.value === String(v));
    return opt ? opt.label : `${formatNumber(Number(v))} ${qq?.number?.unit ?? ''}`.trim();
  };
  const assumed = new Set(p.assumptions.map((a) => a.question));
  const params = data.questions.filter((x) => !x.lead_only && (x.id in p.answers || assumed.has(x.id)));
  const valueOf = (id: string) => (assumed.has(id) ? p.assumptions.find((a) => a.question === id)!.assumed : p.answers[id]);
  const priceText = p.price.kind === 'exact' ? formatMoney(p.price.total) : `от ${formatMoney(p.price.min)} до ${formatMoney(p.price.max)}`;
  const dateText = date.toLocaleDateString('ru-RU');

  return (
    <Document title={`Предварительная программа работ — ${dateText}`} author={company.name} language="ru">
      <Page size="A4" style={s.page}>
        <View style={s.head} fixed>
          <View>
            <Text style={s.company}>{company.name}</Text>
            <Text style={s.muted}>
              {company.phone.display} · {company.email}
            </Text>
          </View>
          <View>
            <Text style={s.muted}>СРО: {company.sro.number}</Text>
            <Text style={s.muted}>Дата расчёта: {dateText}</Text>
          </View>
        </View>

        {p.has_demo_values || p.has_unverified_rules ? (
          <Text style={s.demo}>ДЕМОНСТРАЦИОННЫЙ РАСЧЁТ: цены и правила объёма не проверены инженером. Не использовать для договора.</Text>
        ) : null}

        <Text style={s.kicker}>Предварительная программа работ</Text>
        <Text style={s.h1}>{p.services.map(title).join(' и ')}</Text>

        <View style={s.box}>
          <Text style={s.price}>{priceText}</Text>
          <Text style={s.muted}>
            Без НДС. Срок: {p.duration_days.min}–{p.duration_days.max} дней.
          </Text>
          {p.range_reasons.map((r) => (
            <Text key={r} style={s.muted}>
              {rangeReasonText[r]}
            </Text>
          ))}
        </View>

        <Text style={s.h2}>Параметры объекта</Text>
        {params.map((x) => (
          <View key={x.id} style={s.kv} wrap={false}>
            <Text style={{ flex: 3 }}>{x.title}</Text>
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              {assumed.has(x.id) ? <Text style={s.badge}>ПО УМОЛЧАНИЮ</Text> : null}
              <Text>{label(x.id, valueOf(x.id))}</Text>
            </View>
          </View>
        ))}

        {p.quantities.length ? (
          <>
            <Text style={s.h2} minPresenceAhead={60}>
              Объём работ и обоснование
            </Text>
            {p.quantities.map((x) => (
              <View key={x.id} style={s.row} wrap={false}>
                <View style={s.cWork}>
                  <Text style={{ fontWeight: 600 }}>
                    {x.title}: {formatNumber(x.value)} {x.unit}
                  </Text>
                  <Text style={s.basis}>{x.basis}</Text>
                </View>
                <View style={{ flex: 2.4 }}>
                  {x.norm ? <Text style={s.norm}>{x.norm.code}</Text> : null}
                  {!x.verified ? <Text style={s.basis}>требует проверки инженером</Text> : null}
                </View>
              </View>
            ))}
          </>
        ) : null}

        {p.services.map((sv) => (
          <View key={sv}>
            <Text style={s.h2} minPresenceAhead={60}>
              {title(sv)}: состав работ
            </Text>
            <View style={s.th}>
              <Text style={s.cWork}>Работа</Text>
              <Text style={s.cNorm}>Норматив</Text>
              <Text style={s.cQty}>Объём</Text>
              <Text style={s.cSum}>Стоимость</Text>
            </View>
            {p.items
              .filter((i) => i.service === sv)
              .map((i) => (
                <View key={i.rule} style={s.row} wrap={false}>
                  <View style={s.cWork}>
                    <Text>{i.title}</Text>
                    <Text style={s.basis}>{i.basis}</Text>
                  </View>
                  <Text style={[s.cNorm, s.norm]}>{i.norm?.code ?? '—'}</Text>
                  <Text style={s.cQty}>
                    {formatNumber(i.qty)} {i.unit}
                  </Text>
                  <Text style={s.cSum}>{formatMoney(i.total)}</Text>
                </View>
              ))}
          </View>
        ))}

        <Text style={s.h2} minPresenceAhead={60}>
          Расчёт цены
        </Text>
        <View style={s.kv}>
          <Text>Работы</Text>
          <Text>{formatMoney(p.subtotal)}</Text>
        </View>
        {p.bundle_discount ? (
          <View style={s.kv}>
            <Text>Скидка за геологию и топосъёмку вместе, {p.bundle_discount.percent} %</Text>
            <Text>−{formatMoney(p.bundle_discount.amount)}</Text>
          </View>
        ) : null}
        {p.urgency.multiplier !== 1 ? (
          <View style={s.kv}>
            <Text>{p.urgency.title}</Text>
            <Text>×{formatNumber(p.urgency.multiplier)}</Text>
          </View>
        ) : null}
        <View style={s.kv}>
          <Text>Выезд, {p.travel.title}</Text>
          <Text>{p.travel.price === null ? 'по согласованию' : formatMoney(p.travel.price)}</Text>
        </View>
        <View style={[s.kv, { borderBottomWidth: 1.5, borderBottomColor: colorBorderStrong }]}>
          <Text style={{ fontWeight: 600 }}>Итого</Text>
          <Text style={{ fontWeight: 600 }}>{priceText}</Text>
        </View>

        {p.assumptions.length ? (
          <View>
            <Text style={s.h2} minPresenceAhead={40}>
              Допущения — ответы «Не знаю»
            </Text>
            {p.assumptions.map((a) => (
              <View key={a.question} style={s.assumption} wrap={false}>
                <Text style={{ fontWeight: 600 }}>
                  {q(a.question)?.title} — {label(a.question, a.assumed)}
                </Text>
                <Text>{a.note}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {p.client_checklist.length ? (
          <View>
            <Text style={s.h2} minPresenceAhead={40}>
              Что подготовить заказчику
            </Text>
            {p.client_checklist.map((c) => (
              <Text key={c}>— {c}</Text>
            ))}
          </View>
        ) : null}

        <View style={{ marginTop: 14 }} wrap={false}>
          <Text style={s.muted}>
            Расчёт предварительный и не является публичной офертой. Окончательный объём и цену инженер назовёт после проверки исходных данных. Версия цен: {p.pricing_version}.
          </Text>
          <Text style={[s.muted, { marginTop: 4 }]}>Открыть расчёт онлайн: {shareUrl}</Text>
        </View>

        <Text style={s.footerLeft} fixed>
          {company.legal_name} · ИНН {company.inn} · {company.address}
        </Text>
        {/* Не задавайте lineHeight у Page: в react-pdf 4.9 это прячет render-текст (номер страницы). */}
        <Text style={s.footerRight} fixed render={({ pageNumber, totalPages }) => `Стр. ${pageNumber} из ${totalPages}`} />
      </Page>
    </Document>
  );
}

/** Собирает PDF и отдаёт файл на скачивание. base — basePath сайта ('' или '/repo'). */
export async function downloadProgramPdf(props: PdfProps & { base: string }) {
  registerFonts(props.base);
  const blob = await pdf(<ProgramPdf {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `programma-rabot-${props.date.toISOString().slice(0, 10)}.pdf`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
