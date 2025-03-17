import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './index';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithValue: Story = {
  args: {
    value:
      'This is a sample text that shows how the textarea looks with content.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
};

export const WithCustomHeight: Story = {
  args: {
    placeholder: 'This textarea has a custom height',
    className: 'min-h-[200px]',
  },
};
