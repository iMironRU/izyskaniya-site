import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoContacts } from '@/site/__fixtures__/site';
import type { LeadSender } from '@/lead/types';
import { CallbackForm } from '../CallbackForm/CallbackForm';
import { ContactSheet } from './ContactSheet';

const never: LeadSender = { send: () => new Promise(() => {}) };
const meta = { title: 'Components/ContactSheet', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: () => (
    <div className="min-h-screen">
      <ContactSheet contacts={demoContacts} onClose={() => {}}>
        <CallbackForm kind="callback" sender={never} privacyHref="#" thanksHref="#" phone={demoContacts.phone} />
      </ContactSheet>
    </div>
  ),
};
