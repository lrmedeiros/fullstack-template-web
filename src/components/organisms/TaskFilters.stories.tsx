import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskFilters } from "./TaskFilters";

const meta = {
  title: "Organisms/TaskFilters",
  component: TaskFilters,
} satisfies Meta<typeof TaskFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTasks: Story = {};

export const FilteredByStatus: Story = { args: { status: "in_progress", search: "deploy" } };
