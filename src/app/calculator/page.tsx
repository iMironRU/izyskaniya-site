import type { Metadata } from 'next';
import { CalculatorClient } from './CalculatorClient';
import { loadCalcData } from '@/engine/load';
import { loadCompany } from '@/site/load';

export const metadata: Metadata = {
  title: 'Калькулятор изысканий — предварительная программа работ',
  description: 'Ответьте на несколько вопросов и получите программу работ: объём, состав, срок и цену. Контакты не нужны.',
};

export default function CalculatorPage() {
  const data = loadCalcData();
  const company = loadCompany();
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-4 md:py-10">
      <noscript>
        <p className="text-md leading-normal">
          Калькулятор работает с включённым JavaScript. Позвоните нам: {company.phone.display} — посчитаем по телефону.
        </p>
      </noscript>
      <CalculatorClient data={data} company={company} base={process.env.NEXT_PUBLIC_BASE_PATH ?? ''} />
    </main>
  );
}
