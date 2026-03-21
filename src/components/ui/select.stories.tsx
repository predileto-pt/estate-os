import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  args: {
    placeholder: "Choose an option",
    options: [
      { value: "apartamento", label: "Apartamento" },
      { value: "moradia", label: "Moradia" },
      { value: "terreno", label: "Terreno" },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return <Select {...args} value={value} onValueChange={setValue} />;
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { value: "moradia" },
};
