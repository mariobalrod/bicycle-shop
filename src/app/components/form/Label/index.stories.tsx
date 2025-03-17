import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './index';

const meta: Meta<typeof Label> = {
  title: 'Components/Form/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithHtmlFor: Story = {
  args: {
    htmlFor: 'email',
    children: 'Email',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Label',
    className: 'opacity-70',
  },
};
