import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { mini } from '@/engine/__fixtures__/mini';
import { calculate } from '@/engine/calculate';
import { UNKNOWN } from '@/engine/schema';
import { Result } from './Result';

// Расчёт на тестовой фикстуре (круглые числа), а не на data/: снапшот не зависит от реальных цен.
const exact = calculate(mini, { services: ['geology', 'topo'], object_type: 'house', distance_km: 80, urgency: 'normal', floors: UNKNOWN, area_ha: 0.5, scale: '500' });
const range = calculate(mini, { services: ['geology'], object_type: 'commercial', distance_km: 300, urgency: 'urgent', floors: '2' });

const handlers = { onEdit: fn(), onPdf: fn(), onShare: fn(), onSend: fn(), number: 'П-0412', date: new Date('2026-09-30') };
const meta = { title: 'Screens/Calculator/Result', component: Result, parameters: { layout: 'padded' } } satisfies Meta<typeof Result>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PrivateExact: Story = { args: { data: mini, program: exact, ...handlers } };
export const CommercialRange: Story = { args: { data: mini, program: range, ...handlers } };
export const PdfLoading: Story = { args: { data: mini, program: exact, pdfBusy: true, ...handlers } };
export const LinkCopied: Story = { args: { data: mini, program: exact, shareState: 'copied', ...handlers } };
export const CopyFallback: Story = { args: { data: mini, program: exact, shareState: 'error', sharedUrl: 'https://example.com/calculator/?r=eyJ2IjoxfQ', ...handlers } };
export const PricesChanged: Story = { args: { data: mini, program: exact, pricesChanged: true, ...handlers } };
