import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NormRef } from './NormRef';

const meta = { title: 'Components/NormRef', component: NormRef } satisfies Meta<typeof NormRef>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = { args: { code: 'СП 47.13330.2016' } };
export const Link: Story = { args: { code: 'СП 47.13330.2016', href: '#' } };
export const LinkHover: Story = { args: { code: 'СП 47.13330.2016', href: '#' }, parameters: { pseudo: { hover: true } } };
export const WithClause: Story = { args: { code: 'СП 446.1325800.2019', clause: '[пункт после проверки]' } };
