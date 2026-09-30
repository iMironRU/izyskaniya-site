'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { isValidPhone } from '@/lib/format';

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
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
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [when, setWhen] = useState('');
  const [via, setVia] = useState<ContactMethod>('call');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; email?: string; consent?: string }>({});
  const [state, setState] = useState<FormState>(initialState);

  const build = (): Lead => {
    const page = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const base = { name: name.trim(), phone: tel, page };
    if (kind === 'tz') return { kind, ...base, email: email.trim() || undefined, location: location.trim() || undefined, when: when.trim() || undefined, comment: comment || undefined, files };
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
    // Для ТЗ достаточно телефона или почты; для звонка и расчёта нужен телефон.
    const phoneOk = isValidPhone(tel);
    const emailOk = isEmail(email);
    const next =
      kind === 'tz'
        ? {
            phone: tel && !phoneOk ? 'Введите номер полностью: +7 и 10 цифр' : !tel && !email ? 'Оставьте телефон или почту — иначе мы не сможем ответить' : undefined,
            email: email && !emailOk ? 'Проверьте адрес почты' : undefined,
            consent: consent ? undefined : 'Нужно согласие, чтобы мы могли связаться',
          }
        : {
            phone: phoneOk ? undefined : 'Введите номер полностью: +7 и 10 цифр',
            consent: consent ? undefined : 'Нужно согласие, чтобы мы могли связаться',
          };
    setErrors(next);
    if (!next.phone && !('email' in next && next.email) && !next.consent) void send();
  };

  if (state === 'sent') {
    return (
      <FormStatus tone="success" title="Заявка отправлена" action={<a href={thanksHref} className="type-body text-text-accent underline underline-offset-4">Что будет дальше →</a>}>
        {kind === 'tz' ? 'Инженер изучит задачу и свяжется с вами, чтобы уточнить детали и прислать расчёт.' : 'Перезвоним в рабочее время. Если срочно — '}
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

      {kind === 'tz' ? (
        <>
          <p className="m-0 type-small text-text-muted">Не нужно знать, как называется вид изысканий: опишите объект и какой результат нужен — подберём состав работ.</p>
          <TextAreaField label="Опишите задачу" placeholder="Например: склад 60 × 36 м, нужна геология и топосъёмка под экспертизу" value={comment} onChange={(e) => setComment(e.target.value)} />
          <TextField label="Где объект" hint="Адрес, кадастровый номер или координаты — как удобно" value={location} onChange={(e) => setLocation(e.target.value)} />
          <TextField label="Когда нужен результат" placeholder="Например: к 15 ноября, или «срочно»" value={when} onChange={(e) => setWhen(e.target.value)} />
          <FileUpload files={files} onFiles={setFiles} uploading={state === 'sending'} />
          <TextField label="Как к вам обращаться" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex flex-col gap-4">
            <PhoneField label="Телефон" value={tel} onChange={(e) => setTel(e.target.value)} error={errors.phone} />
            <TextField label="Или почта" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          </div>
        </>
      ) : (
        <>
          <PhoneField label="Телефон" value={tel} onChange={(e) => setTel(e.target.value)} error={errors.phone} required />
          <TextField label="Имя" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          {kind === 'calc' ? <OptionGroup name="via" legend="Как удобнее связаться" options={CONTACTS} value={via} onChange={(v) => setVia(v as ContactMethod)} /> : null}
        </>
      )}

      <Button type="submit" block loading={state === 'sending'}>
        {kind === 'tz' ? 'Отправить ТЗ' : kind === 'calc' ? 'Отправить инженеру' : 'Перезвоните мне'}
      </Button>
      <Checkbox checked={consent} onChange={setConsent} error={errors.consent}>
        Согласен на <a href={privacyHref}>обработку персональных данных</a>
      </Checkbox>
    </form>
  );
}
