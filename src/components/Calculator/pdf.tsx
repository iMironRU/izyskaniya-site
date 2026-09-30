// PDF «Предварительная программа работ» (A4) по макету design/handoff/prototype/PDF - Программа работ.dc.html.
// Грузится лениво по кнопке — в основной бандл не попадает. Цвета — из TS-констант токенов,
// шрифты — цельные TTF Cormorant Garamond и Lora из public/fonts/pdf (scripts/build-pdf-fonts.py).
import { Circle, Document, Font, Line, Page, Rect, StyleSheet, Svg, Text, View, pdf } from '@react-pdf/renderer';
import {
  colorAccentDefault,
  colorBgDefault,
  colorBorderDefault,
  colorBorderStrong,
  colorTextAccent,
  colorTextDefault,
  colorTextMuted,
  colorTextSecondary,
  tagAccentBg,
  tagAccentText,
} from '@tokens';
import { boreholePoints } from '@/components/Borehole/BoreholeScheme';
import { parseDims } from '@/engine/dims';
import type { CalcData, Program, ServiceId } from '@/engine/schema';
import type { Company } from '@/site/schema';
import { formatMoney, formatNumber } from '@/lib/format';
import { answerText } from './quiz';
import { rangeReasonText, serviceShort } from './texts';

let fontsReady = false;
export function registerFonts(base: string) {
  if (fontsReady) return;
  Font.register({
    family: 'Lora',
    fonts: [
      { src: `${base}/fonts/pdf/Lora-Regular.ttf` },
      { src: `${base}/fonts/pdf/Lora-Italic.ttf`, fontStyle: 'italic' },
      { src: `${base}/fonts/pdf/Lora-SemiBold.ttf`, fontWeight: 600 },
    ],
  });
  Font.register({
    family: 'Cormorant',
    fonts: [
      { src: `${base}/fonts/pdf/CormorantGaramond-Regular.ttf` },
      { src: `${base}/fonts/pdf/CormorantGaramond-SemiBold.ttf`, fontWeight: 600 },
    ],
  });
  // Не переносить слова по слогам.
  Font.registerHyphenationCallback((w) => [w]);
  fontsReady = true;
}

// Не задавайте lineHeight у Page: в react-pdf 4.9 это прячет render-текст (номер страницы).
const s = StyleSheet.create({
  page: { fontFamily: 'Lora', fontSize: 8.5, color: colorTextDefault, paddingTop: 40, paddingBottom: 48, paddingHorizontal: 44 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: colorBorderStrong, paddingBottom: 8, marginBottom: 14 },
  brand: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 16, letterSpacing: 2 },
  muted: { color: colorTextMuted },
  small: { fontSize: 6.5, color: colorTextMuted },
  kicker: { fontSize: 7, letterSpacing: 1, color: colorTextAccent, marginBottom: 4 },
  h1: { fontFamily: 'Cormorant', fontSize: 20, marginBottom: 10 },
  h2: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 11.5, marginBottom: 5, marginTop: 12 },
  kv: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colorBorderDefault, paddingVertical: 3.5 },
  badge: { fontSize: 5.5, backgroundColor: tagAccentBg, color: tagAccentText, paddingHorizontal: 3, paddingVertical: 1, marginLeft: 4 },
  th: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colorBorderDefault, paddingVertical: 4, fontSize: 6, letterSpacing: 0.8, color: colorTextMuted },
  tr: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colorBorderDefault, paddingVertical: 5 },
  cWork: { flex: 4, paddingRight: 6 },
  cQty: { flex: 3, paddingRight: 6 },
  cNorm: { flex: 2.6, paddingRight: 6 },
  cSum: { flex: 1.6, textAlign: 'right' },
  cols: { flexDirection: 'row', gap: 18 },
  col: { flex: 1 },
  justify: { textAlign: 'justify', color: colorTextSecondary },
  price: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colorBorderStrong, paddingVertical: 8, marginTop: 14 },
  figure: { fontFamily: 'Cormorant', fontSize: 22 },
  footerLeft: { position: 'absolute', bottom: 22, left: 44, right: 110, fontSize: 6, color: colorTextMuted },
  footerRight: { position: 'absolute', bottom: 22, left: 44, right: 44, fontSize: 6, color: colorTextMuted, textAlign: 'right' },
});

interface PdfProps {
  data: CalcData;
  program: Program;
  company: Company;
  shareUrl: string;
  date: Date;
  number: string;
}

function Scheme({ length, width, count }: { length: number; width: number; count: number }) {
  const W = 120;
  const k = W / Math.max(length, width);
  const w = Math.max(length * k, 40);
  const h = Math.min(Math.max(width * k, 30), 80);
  const ox = 22;
  const oy = 16;
  return (
    <Svg width={170} height={h + 36}>
      <Rect x={ox} y={oy} width={w} height={h} stroke={colorTextDefault} strokeWidth={0.8} fill="none" />
      <Line x1={ox} x2={ox + w} y1={oy - 8} y2={oy - 8} stroke={colorTextMuted} strokeWidth={0.5} />
      <Text x={ox + w / 2 - 8} y={oy - 11} style={{ fontSize: 6, fontFamily: 'Lora' }}>
        {`${formatNumber(length)} м`}
      </Text>
      <Line x1={ox + w + 8} x2={ox + w + 8} y1={oy} y2={oy + h} stroke={colorTextMuted} strokeWidth={0.5} />
      <Text x={ox + w + 11} y={oy + h / 2 + 2} style={{ fontSize: 6, fontFamily: 'Lora' }}>
        {`${formatNumber(width)} м`}
      </Text>
      {boreholePoints(count).map(([px, py], i) => (
        <Circle key={i} cx={ox + px * w} cy={oy + py * h} r={3.5} stroke={colorAccentDefault} strokeWidth={1.2} fill={colorBgDefault} />
      ))}
    </Svg>
  );
}

export function ProgramPdf({ data, program: p, company, shareUrl, date, number }: PdfProps) {
  const q = (id: string) => data.questions.find((x) => x.id === id);
  const assumed = new Map(p.assumptions.map((a) => [a.question, a]));
  const params = data.questions.filter((x) => !x.lead_only && x.summary && x.id !== 'services' && (x.id in p.answers || assumed.has(x.id)));
  const valueOf = (id: string) => (assumed.has(id) ? assumed.get(id)!.assumed : p.answers[id]);
  const priceText = p.price.kind === 'exact' ? formatMoney(p.price.total) : `${formatMoney(p.price.min)} — ${formatMoney(p.price.max)}`;
  const dateText = date.toLocaleDateString('ru-RU');
  const title = p.services.length === 2 ? 'Геология и топосъёмка' : p.services[0] === 'topo' ? 'Топосъёмка' : 'Инженерная геология';
  const dims = parseDims(valueOf('dims'));
  const bh = p.quantities.find((x) => x.id === 'boreholes');
  const depth = p.quantities.find((x) => x.id === 'depth_m');
  const cadastral = typeof p.answers.cadastral === 'string' ? p.answers.cadastral : null;
  const bySvc = (sv: ServiceId) => p.items.filter((i) => i.service === sv).reduce((sum, i) => sum + i.total, 0);
  const norms = [...new Set([...p.quantities, ...p.items].filter((x) => x.norm).map((x) => x.norm!.code))];

  return (
    <Document title={`Предварительная программа работ № ${number}`} author={company.name} language="ru">
      <Page size="A4" style={s.page}>
        <View style={s.head} fixed>
          <View>
            <Text style={s.brand}>{company.name.toUpperCase()}</Text>
            <Text style={s.small}>
              {company.legal_name} · ИНН {company.inn} · СРО {company.sro.number}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text>{company.phone.display}</Text>
            <Text style={s.muted}>{company.email}</Text>
          </View>
        </View>

        {p.has_demo_values || p.has_unverified_rules ? (
          <Text style={[s.small, { color: colorTextAccent, marginBottom: 6 }]}>ДЕМОНСТРАЦИОННЫЙ РАСЧЁТ: цены и правила объёма не проверены инженером. Не использовать для договора.</Text>
        ) : null}

        <Text style={s.kicker}>
          ПРЕДВАРИТЕЛЬНАЯ ПРОГРАММА РАБОТ № {number} · {dateText}
        </Text>
        <Text style={s.h1}>{title}</Text>

        <View style={s.cols}>
          <View style={[s.col, { flex: 1.5 }]}>
            <Text style={[s.h2, { marginTop: 0 }]}>Параметры объекта</Text>
            {params.map((x) => (
              <View key={x.id} style={s.kv} wrap={false}>
                <Text style={[s.muted, { flex: 1 }]}>{x.summary}</Text>
                <View style={{ flex: 1.6, flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{x.ui === 'map' && cadastral ? cadastral : answerText(x, valueOf(x.id))}</Text>
                  {assumed.has(x.id) ? <Text style={s.badge}>принято по умолчанию</Text> : null}
                </View>
              </View>
            ))}
          </View>
          {dims && bh ? (
            <View style={[s.col, { borderWidth: 0.5, borderColor: colorBorderDefault, padding: 6, alignItems: 'center' }]}>
              <Scheme length={dims.length} width={dims.width} count={bh.value} />
              <Text style={s.small}>Схема скважин, без масштаба</Text>
            </View>
          ) : null}
        </View>

        <Text style={s.h2}>Состав работ</Text>
        <View style={s.th}>
          <Text style={s.cWork}>РАБОТА</Text>
          <Text style={s.cQty}>ОБЪЁМ</Text>
          <Text style={s.cNorm}>НОРМАТИВ</Text>
          <Text style={s.cSum}>СТОИМОСТЬ</Text>
        </View>
        {p.items.map((i) => (
          <View key={`${i.service}-${i.rule}`} style={s.tr} wrap={false}>
            <Text style={s.cWork}>{i.title}</Text>
            <Text style={s.cQty}>
              {formatNumber(i.qty)} {i.unit}
            </Text>
            <Text style={s.cNorm}>{i.norm?.code ?? '—'}</Text>
            <Text style={s.cSum}>{formatMoney(i.total)}</Text>
          </View>
        ))}
        {p.bundle_discount ? (
          <View style={s.tr}>
            <Text style={[s.muted, { flex: 9.6 }]}>Скидка за пакет «геология + топо», {p.bundle_discount.percent} %</Text>
            <Text style={s.cSum}>−{formatMoney(p.bundle_discount.amount)}</Text>
          </View>
        ) : null}
        <View style={s.tr}>
          <Text style={[s.muted, { flex: 9.6 }]}>Выезд, {p.travel.title}</Text>
          <Text style={s.cSum}>{p.travel.price === null ? 'по согласованию' : formatMoney(p.travel.price)}</Text>
        </View>

        <View style={[s.cols, { marginTop: 4 }]} wrap={false}>
          <View style={s.col}>
            <Text style={s.h2}>Обоснование</Text>
            <Text style={s.justify}>
              {dims && bh && depth
                ? `Для пятна ${formatNumber(dims.length)} × ${formatNumber(dims.width)} м (${formatNumber(Math.round(dims.length * dims.width))} м²) — ${formatNumber(bh.value)} скв. по ${formatNumber(depth.value)} м. ${bh.basis} ${depth.basis}`
                : p.items.map((i) => i.basis).join(' ')}
              {norms.length ? ` (${norms.join('; ')})` : ''}
            </Text>
          </View>
          <View style={s.col}>
            <Text style={s.h2}>Допущения</Text>
            <Text style={s.justify}>
              {p.assumptions.length
                ? `Вместо ответа «не знаю» приняты: ${p.assumptions
                    .map((a) => {
                      const qq = q(a.question);
                      return `${(qq?.summary ?? a.title).toLowerCase()} — ${qq ? answerText(qq, a.assumed) : String(a.assumed)}`;
                    })
                    .join('; ')}. Если параметры отличаются, объём и цена будут пересчитаны.`
                : 'Все параметры указаны заказчиком.'}
            </Text>
          </View>
        </View>

        <View style={s.price} wrap={false}>
          <View>
            <Text style={[s.small, { letterSpacing: 0.8 }]}>ПРЕДВАРИТЕЛЬНАЯ СТОИМОСТЬ · БЕЗ НДС</Text>
            <Text style={s.figure}>{priceText}</Text>
            {p.services.length > 1 ? <Text style={s.small}>{p.services.map((sv) => `${serviceShort[sv]} ${formatMoney(bySvc(sv))}`).join(' · ')}</Text> : null}
            {p.range_reasons.map((r) => (
              <Text key={r} style={s.small}>
                {rangeReasonText[r]}
              </Text>
            ))}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.small, { letterSpacing: 0.8 }]}>СРОК</Text>
            <Text style={[s.figure, { fontSize: 16 }]}>
              {p.duration_days.min === p.duration_days.max ? p.duration_days.min : `${p.duration_days.min}–${p.duration_days.max}`} рабочих дней
            </Text>
          </View>
        </View>

        <View style={[s.cols, { marginTop: 16 }]} wrap={false}>
          <View style={s.col}>
            <Text style={[s.small, { letterSpacing: 0.8, marginBottom: 3 }]}>ЧТО ПОДГОТОВИТЬ</Text>
            <Text>{p.client_checklist.join(' · ')}</Text>
          </View>
          <View style={s.col}>
            <Text style={[s.small, { letterSpacing: 0.8, marginBottom: 3 }]}>КОНТАКТЫ</Text>
            <Text>
              {company.phone.display} · {company.email}
            </Text>
            <Text>{company.address}</Text>
          </View>
        </View>
        <Text style={[s.small, { marginTop: 10 }]}>Расчёт онлайн: {shareUrl}</Text>

        <Text style={s.footerLeft} fixed>
          Предварительный расчёт. Не является офертой. Окончательный объём задаёт программа работ после выезда инженера. Версия цен {p.pricing_version}.
        </Text>
        <Text style={s.footerRight} fixed render={({ pageNumber, totalPages }) => `стр. ${pageNumber} из ${totalPages}`} />
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
  a.download = `programma-rabot-${props.number}.pdf`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
