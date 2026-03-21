import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const Wide: Story = {
  args: { className: "w-48 h-4" },
};

export const Circle: Story = {
  args: { className: "w-10 h-10 rounded-full" },
};
