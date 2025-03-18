import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { RadioGroup, RadioGroupItem } from './index';
import { Label } from '../Label';

const meta = {
  title: 'Components/Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabledOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Available Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" disabled />
        <Label htmlFor="option-2" className="text-gray-400">
          Disabled Option
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Available Option</Label>
      </div>
    </RadioGroup>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="grid grid-cols-2 gap-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="option-1" className="font-medium">
            Basic Plan
          </Label>
          <p className="text-sm text-gray-500">$10/month</p>
        </div>
        <RadioGroupItem value="option-1" id="option-1" className="ml-3" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="option-2" className="font-medium">
            Pro Plan
          </Label>
          <p className="text-sm text-gray-500">$20/month</p>
        </div>
        <RadioGroupItem value="option-2" id="option-2" className="ml-3" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="option-3" className="font-medium">
            Team Plan
          </Label>
          <p className="text-sm text-gray-500">$40/month</p>
        </div>
        <RadioGroupItem value="option-3" id="option-3" className="ml-3" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50">
        <div className="space-y-1">
          <Label htmlFor="option-4" className="font-medium text-gray-400">
            Enterprise Plan
          </Label>
          <p className="text-sm text-gray-400">Contact us</p>
        </div>
        <RadioGroupItem
          value="option-4"
          id="option-4"
          className="ml-3"
          disabled
        />
      </div>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState('option-1');

    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="controlled-1" />
            <Label htmlFor="controlled-1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="controlled-2" />
            <Label htmlFor="controlled-2">Option 2</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-gray-500">
          Selected value: <code className="text-primary">{value}</code>
        </p>
      </div>
    );
  },
};
