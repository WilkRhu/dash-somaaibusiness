import type { Meta, StoryObj } from '@storybook/react';
import { AdminNavigation } from './AdminNavigation';

const meta: Meta<typeof AdminNavigation> = {
  title: 'Admin/AdminNavigation',
  component: AdminNavigation,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdminNavigation>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveDashboard: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveUsers: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveTickets: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveLogs: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveReports: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const ActiveSystem: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};