import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Small } from "./small";

const meta: Meta<typeof Small> = {
  title: "UI/Small",
  component: Small,
  args: { children: "Small text" },
};

export default meta;
type Story = StoryObj<typeof Small>;

export const Default: Story = {};

export const Label: Story = {
  args: { variant: "label", children: "Field label" },
};
