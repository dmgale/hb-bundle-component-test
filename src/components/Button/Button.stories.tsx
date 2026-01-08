import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Add to basket',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Add to basket',
    disabled: false,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    children: 'Add to basket',
    disabled: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    children: 'Add to basket',
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    variant: 'primary',
    children: 'Add all selected items to your basket',
    disabled: false,
  },
};

export const ShortText: Story = {
  args: {
    variant: 'secondary',
    children: 'Buy',
    disabled: false,
  },
};
