import type { Meta, StoryObj } from '@storybook/react';

import { CartSummary } from '.';

const meta: Meta<typeof CartSummary> = {
  title: 'Main/Cart/Summary',
  component: CartSummary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartSummary>;

export const Default: Story = {
  args: {
    subtotal: 95.99,
    onCheckout: () => alert('Checkout clicked'),
  },
};

export const WithFreeShipping: Story = {
  args: {
    subtotal: 150.0,
    onCheckout: () => alert('Checkout clicked'),
  },
};

export const EmptyCart: Story = {
  args: {
    subtotal: 0,
    onCheckout: () => alert('Checkout clicked'),
  },
};
