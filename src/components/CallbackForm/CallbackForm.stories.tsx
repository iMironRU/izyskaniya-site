import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { LeadSender } from '@/lead/types';
import { CallbackForm } from './CallbackForm';
import { FormStatus } from './FormStatus';

const never: LeadSender = { send: () => new Promise(() => {}) };
const common = { sender: never, privacyHref: '#', thanksHref: '#', phone: { display: '+7 (000) 000-00-00', tel: '+70000000000' } };

const meta = { title: 'Components/CallbackForm', component: CallbackForm } satisfies Meta<typeof CallbackForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Callback: Story = { args: { ...common, kind: 'callback' } };
export const Tz: Story = { args: { ...common, kind: 'tz', lead: 'Смета в течение рабочего дня.' } };
export const Sending: Story = { args: { ...common, kind: 'callback', initialState: 'sending' } };
export const Sent: Story = { args: { ...common, kind: 'callback', initialState: 'sent' } };
export const Error: Story = { args: { ...common, kind: 'callback', initialState: 'error' } };
export const Offline: Story = { args: { ...common, kind: 'callback', initialState: 'offline' } };
export const StatusInfo: Story = { args: { ...common, kind: 'callback' }, render: () => <FormStatus tone="info" title="Цены обновились">Расчёт пересчитан по действующим ценам.</FormStatus> };
