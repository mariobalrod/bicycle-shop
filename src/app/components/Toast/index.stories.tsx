import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';

import { Toaster } from './index';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        onClick={() => toast('This is a toast notification')}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Show Toast
      </button>
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        onClick={() => toast.success('Operation completed successfully!')}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Show Success Toast
      </button>
    </>
  ),
};

export const Error: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        onClick={() => toast.error('Something went wrong!')}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Show Error Toast
      </button>
    </>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        onClick={() =>
          toast('Profile updated', {
            description: 'Your profile has been successfully updated.',
          })
        }
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Show Toast with Description
      </button>
    </>
  ),
};
