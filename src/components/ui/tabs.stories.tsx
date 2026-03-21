import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "overview");
    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-gray-600">Overview content goes here.</p>
        </TabsContent>
        <TabsContent value="details">
          <p className="text-sm text-gray-600">Details content goes here.</p>
        </TabsContent>
        <TabsContent value="history">
          <p className="text-sm text-gray-600">History content goes here.</p>
        </TabsContent>
      </Tabs>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: { value: "overview" },
};

export const SecondTab: Story = {
  args: { value: "details" },
};
