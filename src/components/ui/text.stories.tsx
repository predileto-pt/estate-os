import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "UI/Text",
  component: Text,
  args: { children: "This is a paragraph of text used throughout the application." },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Muted: Story = {
  args: { variant: "muted" },
};
