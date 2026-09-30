import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

const meta = { title: 'Components/FileUpload' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial = [], uploading }: { initial?: File[]; uploading?: boolean }) {
  const [f, setF] = useState<File[]>(initial);
  return <FileUpload files={f} onFiles={setF} uploading={uploading} />;
}
const tz = () => new File([new Uint8Array(2_400_000)], 'ТЗ на изыскания.pdf', { type: 'application/pdf' });
const kml = () => new File([new Uint8Array(18_000)], 'Границы участка.kml', { type: 'application/vnd.google-earth.kml+xml' });

export const Empty: Story = { render: () => <Demo /> };
export const Hover: Story = { render: () => <Demo />, parameters: { pseudo: { hover: ['label'] } } };
export const Selected: Story = { render: () => <Demo initial={[tz(), kml()]} /> };
export const Uploading: Story = { render: () => <Demo initial={[tz()]} uploading /> };
