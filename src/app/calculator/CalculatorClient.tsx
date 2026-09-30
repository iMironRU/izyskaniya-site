'use client';

import dynamic from 'next/dynamic';
import type { CalculatorProps } from '@/components/Calculator/Calculator';
import { demoSender } from '@/lead/demo';

// Калькулятор живёт только в браузере: состояние читается из ссылки и черновика вкладки.
// Для поисковиков и без JS страница показывает вводный текст (см. page.tsx).
const Calculator = dynamic(() => import('@/components/Calculator/Calculator').then((m) => m.Calculator), {
  ssr: false,
  loading: () => <p className="text-md text-text-secondary">Загружаем калькулятор…</p>,
});

// Отправитель заявок выбирается на клиенте: функцию нельзя передать из серверного компонента.
// Этап 7: выбор адаптера по NEXT_PUBLIC_LEAD_ENDPOINT.
export function CalculatorClient(props: Pick<CalculatorProps, 'data' | 'company' | 'base'>) {
  const base = props.base;
  return <Calculator {...props} sender={demoSender} homeHref={`${base}/`} privacyHref={`${base}/privacy/`} />;
}
