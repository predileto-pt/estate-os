import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Button" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Primary: Story = {
  args: { variant: "primary", children: "Save" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Continue" },
};

export const Steel: Story = {
  args: { variant: "steel", children: "Cancel" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Disabled", disabled: true },
};
