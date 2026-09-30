'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { isValidPhone } from '@/lib/format';
import type { CalcLead, ContactMethod, Lead, LeadSender } from '@/lead/types';
import { Button } from '../Button/Button';
import { FileUpload } from '../FileUpload/FileUpload';
import { Checkbox, PhoneField, TextAreaField, TextField } from '../Input/Input';
import { OptionGroup } from '../OptionTile/OptionGroup';
import { FormStatus } from './FormStatus';

export type FormState = 'idle' | 'sending' | 'sent' | 'error' | 'offline';

export interface CallbackFormProps {
  kind: 'callback' | 'tz' | 'calc';
  title?: string;
  lead?: string;
  sender: LeadSender;
  privacyHref: string;
  thanksHref: string;
  phone: { display: string; tel: string };
  /** Для kind=calc: расчёт, который уйдёт вместе с контактом */
  calc?: Omit<CalcLead, 'kind' | 'name' | 'phone' | 'contact'>;
  /** Для стори */
  initialState?: FormState;
}

const TITLES = { callback: 'Перезвоните мне', tz: 'Отправить ТЗ', calc: 'Отправить расчёт инженеру' };
const CONTACTS: Array<{ value: ContactMethod; label: string }> = [
  { value: 'call', label: 'Позвонить' },
  { value: 'telegram', label: 'Написать в Telegram' },
  { value: 'whatsapp', label: 'Написать в WhatsApp' },
];

/** components/callback-form.md — «Перезвоните мне» / «Отправить ТЗ» (+ вариант калькулятора). Открывается только по действию пользователя. */
export function CallbackForm({ kind, title, lead, sender, privacyHref, thanksHref, phone, calc, initialState = 'idle' }: CallbackFormProps) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [via, setVia] = useState<ContactMethod>('call');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; consent?: string }>({});
  const [state, setState] = useState<FormState>(initialState);

  const build = (): Lead => {
    const page = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const base = { name: name.trim(), phone: tel, page };
    if (kind === 'tz') return { kind, ...base, comment: comment || undefined, file: file ?? undefined };
    if (kind === 'calc' && calc) return { kind, ...base, contact: via, ...calc };
    return { kind: 'callback', ...base, comment: comment || undefined };
  };

  const send = async () => {
    setState('sending');
    const r = await sender.send(build());
    setState(r.ok ? 'sent' : r.reason);
  };

  useEffect(() => {
    if (state !== 'offline') return;
    const retry = () => void send();
    window.addEventListener('online', retry, { once: true });
    return () => window.removeEventListener('online', retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = {
      phone: isValidPhone(tel) ? undefined : 'Введите номер полностью: +7 и 10 цифр',
      consent: consent ? undefined : 'Нужно согласие, чтобы мы могли связаться',
    };
    setErrors(next);
    if (!next.phone && !next.consent) void send();
  };

  if (state === 'sent') {
    return (
      <FormStatus tone="success" title="Заявка отправлена" action={<a href={thanksHref} className="type-body text-text-accent underline underline-offset-4">Что будет дальше →</a>}>
        {kind === 'tz' ? 'Инженер посмотрит ТЗ и пришлёт смету в течение рабочего дня.' : 'Перезвоним в рабочее время. Если срочно — '}
        {kind !== 'tz' ? <a href={`tel:${phone.tel}`}>{phone.display}</a> : null}
      </FormStatus>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 type-h3">{title ?? TITLES[kind]}</h2>
        {lead ? <p className="m-0 type-body text-text-secondary">{lead}</p> : null}
      </div>

      {state === 'offline' ? (
        <FormStatus tone="offline" title="Нет сети">
          Заявка сохранена на этой странице. Отправим сами, когда появится связь, — не закрывайте страницу.
        </FormStatus>
      ) : null}
      {state === 'error' ? (
        <FormStatus
          tone="error"
          title="Не получилось отправить"
          action={
            <Button variant="secondary" onClick={() => void send()}>
              Повторить
            </Button>
          }
        >
          Попробуйте ещё раз или позвоните: <a href={`tel:${phone.tel}`}>{phone.display}</a>. Введённые данные сохранены.
        </FormStatus>
      ) : null}

      <PhoneField label="Телефон" value={tel} onChange={(e) => setTel(e.target.value)} error={errors.phone} required />
      <TextField label="Имя" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      {kind === 'calc' ? <OptionGroup name="via" legend="Как удобнее связаться" options={CONTACTS} value={via} onChange={(v) => setVia(v as ContactMethod)} /> : null}
      {kind === 'tz' ? (
        <>
          <FileUpload file={file} onFile={setFile} uploading={state === 'sending'} />
          <TextAreaField label="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />
        </>
      ) : null}

      <Button type="submit" block loading={state === 'sending'}>
        {kind === 'tz' ? 'Отправить ТЗ' : kind === 'calc' ? 'Отправить инженеру' : 'Перезвоните мне'}
      </Button>
      <Checkbox checked={consent} onChange={setConsent} error={errors.consent}>
        Согласен на <a href={privacyHref}>обработку персональных данных</a>
      </Checkbox>
    </form>
  );
}
