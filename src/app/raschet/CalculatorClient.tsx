'use client';

import dynamic from 'next/dynamic';
import type { CalculatorProps } from '@/components/Calculator/Calculator';
import { demoSender } from '@/lead/demo';
import { href } from '@/site/routes';

// Калькулятор живёт только в браузере: состояние читается из ссылки, сценария ?s= и черновика вкладки.
const Calculator = dynamic(() => import('@/components/Calculator/Calculator').then((m) => m.Calculator), {
  ssr: false,
  loading: () => <p className="type-body text-text-muted">Загружаем калькулятор…</p>,
});

// Отправитель заявок выбирается на клиенте: функцию нельзя передать из серверного компонента. Этап 7 — реальные адаптеры.
export function CalculatorClient(props: Pick<CalculatorProps, 'data' | 'company' | 'contacts' | 'base'>) {
  return <Calculator {...props} sender={demoSender} homeHref={href('home')} privacyHref={href('privacy')} thanksHref={href('spasibo')} />;
}
