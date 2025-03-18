import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './index';

const meta: Meta<typeof Switch> = {
  title: 'Components/Form/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Unchecked: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};
