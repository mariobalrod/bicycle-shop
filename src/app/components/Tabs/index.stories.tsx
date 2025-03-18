import type { Meta, StoryObj } from '@storybook/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './index';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your account and set your preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Change your password here.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
