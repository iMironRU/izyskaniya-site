import type { Metadata } from 'next';
import { loadSite } from '@/site/load';
import { Container } from '@/site/ui/Layout';
import { CalculatorClient } from './CalculatorClient';

export const metadata: Metadata = {
  title: 'Калькулятор — предварительная программа работ',
  description: 'Ответьте на несколько вопросов и получите программу работ: объём, состав, срок и цену. Контакты не нужны.',
};

export default function CalculatorPage() {
  const site = loadSite();
  return (
    <Container className="py-8">
      <noscript>
        <p className="type-body">Калькулятор работает с включённым JavaScript. Позвоните нам: {site.contacts.phone.display} — посчитаем по телефону.</p>
      </noscript>
      <CalculatorClient data={site.calc} company={site.company} contacts={site.contacts} base={process.env.NEXT_PUBLIC_BASE_PATH ?? ''} />
    </Container>
  );
}
