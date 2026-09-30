import type { Answers, Question } from '@/engine/schema';
import { answerText } from './quiz';

/** Сводка «Ваш объект» справа от шага (desktop). */
export function Summary({ steps, answers, cadastral }: { steps: Question[]; answers: Answers; cadastral?: string }) {
  return (
    <aside aria-label="Ваш объект" className="flex flex-col gap-3">
      <dl className="m-0 border-t border-border-strong">
        <dt className="py-3 type-kicker text-text-muted">Ваш объект</dt>
        {steps.map((q) => (
          <div key={q.id} className="flex items-baseline justify-between gap-3 border-t border-border-default py-2 type-small">
            <dt className="text-text-muted">{q.summary ?? q.title}</dt>
            <dd className="m-0 text-right text-text-default nums">
              {q.ui === 'map' && cadastral ? `кадастр ${cadastral}` : answerText(q, answers[q.id])}
            </dd>
          </div>
        ))}
      </dl>
      <p className="m-0 type-small text-text-muted">Контакты не нужны, чтобы увидеть расчёт. Спросим их, только если захотите отправить его инженеру.</p>
    </aside>
  );
}
