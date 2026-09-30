import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { LeadSender } from '@/lead/types';
import { LeadForm } from './LeadForm';

const never: LeadSender = { send: () => new Promise(() => {}) };
const lead = { answers: {}, price: { kind: 'exact' as const, total: 50000 }, pricing_version: 'test', share_url: 'https://example.com' };
const common = { sender: never, lead, privacyHref: '#', phone: { display: '+7 (000) 000-00-00', tel: '+70000000000' } };

const meta = { title: 'Screens/Calculator/LeadForm', component: LeadForm, parameters: { layout: 'padded' } } satisfies Meta<typeof LeadForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: common };
export const Sending: Story = { args: { ...common, initialStatus: 'sending' } };
export const Sent: Story = { args: { ...common, initialStatus: 'sent' } };
export const SendError: Story = { args: { ...common, initialStatus: 'error' } };
export const Offline: Story = { args: { ...common, initialStatus: 'offline' } };
export const ValidationErrors: Story = {
  args: common,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[type=submit]')?.click();
  },
  tags: ['no-snapshot'],
};
