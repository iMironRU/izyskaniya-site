import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

const meta = { title: 'Components/FileUpload' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, uploading }: { initial?: File; uploading?: boolean }) {
  const [f, setF] = useState<File | null>(initial ?? null);
  return <FileUpload file={f} onFile={setF} uploading={uploading} />;
}
const sample = () => new File([new Uint8Array(2_400_000)], 'ТЗ на изыскания.pdf', { type: 'application/pdf' });

export const Empty: Story = { render: () => <Demo /> };
export const Hover: Story = { render: () => <Demo />, parameters: { pseudo: { hover: ['label'] } } };
export const Selected: Story = { render: () => <Demo initial={sample()} /> };
export const Uploading: Story = { render: () => <Demo initial={sample()} uploading /> };
