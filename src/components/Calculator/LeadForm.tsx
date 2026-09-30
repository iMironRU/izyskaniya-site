'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button/Button';
import { PhoneField, TextField } from '@/components/Field/Field';
import { Notice } from '@/components/Notice/Notice';
import { OptionGroup } from '@/components/OptionTile/OptionGroup';
import { isValidPhone } from '@/lib/format';
import type { ContactMethod, Lead, LeadSender } from '@/lead/types';

export interface LeadFormProps {
  sender: LeadSender;
  /** Всё, кроме контактов, — расчёт и ссылка */
  lead: Omit<Lead, 'name' | 'phone' | 'contact'>;
  privacyHref: string;
  phone: { display: string; tel: string };
  /** Для стори: начальное состояние */
  initialStatus?: Status;
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'offline';

const CONTACTS: Array<{ value: ContactMethod; label: string }> = [
  { value: 'call', label: 'Позвонить' },
  { value: 'telegram', label: 'Написать в Telegram' },
  { value: 'whatsapp', label: 'Написать в WhatsApp' },
];

export function LeadForm({ sender, lead, privacyHref, phone, initialStatus = 'idle' }: LeadFormProps) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [contact, setContact] = useState<ContactMethod>('call');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; consent?: string }>({});
  const [status, setStatus] = useState<Status>(initialStatus);

  const send = async () => {
    setStatus('sending');
    const r = await sender.send({ ...lead, name: name.trim(), phone: tel, contact });
    setStatus(r.ok ? 'sent' : r.reason);
  };

  // Нет сети: отправим сами, когда связь появится.
  useEffect(() => {
    if (status !== 'offline') return;
    const retry = () => void send();
    window.addEventListener('online', retry, { once: true });
    return () => window.removeEventListener('online', retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = {
      phone: isValidPhone(tel) ? undefined : 'Введите номер полностью: +7 и 10 цифр',
      consent: consent ? undefined : 'Нужно согласие, чтобы мы могли вам позвонить',
    };
    setErrors(next);
    if (!next.phone && !next.consent) void send();
  };

  if (status === 'sent') {
    return (
      <Notice tone="success" title="Заявка отправлена">
        Инженер посмотрит расчёт и свяжется с вами в рабочее время. Если срочно — позвоните: <a href={`tel:${phone.tel}`}>{phone.display}</a>.
      </Notice>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-xl font-semibold">Отправить расчёт инженеру</h2>
        <p className="m-0 text-md leading-normal text-text-secondary">Инженер проверит допущения и назовёт окончательную цену. Расчёт приложим к заявке.</p>
      </div>

      {status === 'offline' ? (
        <Notice tone="offline" title="Нет сети">
          Заявка сохранена на этой странице. Отправим её сами, когда появится связь, — не закрывайте страницу.
        </Notice>
      ) : null}
      {status === 'error' ? (
        <Notice
          tone="error"
          title="Не получилось отправить"
          action={
            <Button variant="secondary" onClick={() => void send()}>
              Повторить
            </Button>
          }
        >
          Попробуйте ещё раз или позвоните: <a href={`tel:${phone.tel}`}>{phone.display}</a>. Расчёт сохранён.
        </Notice>
      ) : null}

      <TextField label="Как к вам обращаться" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <PhoneField label="Телефон" value={tel} onChange={(e) => setTel(e.target.value)} error={errors.phone} required />
      <OptionGroup name="contact" legend="Как удобнее связаться" options={CONTACTS} value={contact} onChange={(v) => setContact(v as ContactMethod)} />

      <div className="flex flex-col gap-2">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-md leading-normal">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="mt-1 size-5 shrink-0 accent-accent-default"
          />
          <span>
            Согласен на <a href={privacyHref}>обработку персональных данных</a>
          </span>
        </label>
        {errors.consent ? (
          <p id="consent-error" className="m-0 text-sm text-status-error">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" block loading={status === 'sending'}>
        Отправить инженеру
      </Button>
    </form>
  );
}
