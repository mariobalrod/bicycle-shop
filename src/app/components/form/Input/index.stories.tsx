import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Components/Form/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello World',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithType: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};
