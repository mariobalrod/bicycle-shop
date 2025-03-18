import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './index';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: 'h-4 w-3/4',
  },
};

export const Square: Story = {
  args: {
    className: 'h-32 w-32',
  },
};

export const Circle: Story = {
  args: {
    className: 'h-16 w-16 rounded-full',
  },
};

export const Text: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="w-[300px] space-y-4 p-4">
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};
