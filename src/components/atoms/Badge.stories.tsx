import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "A fazer" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge tone="neutral">A fazer</Badge>
      <Badge tone="warning">Em andamento</Badge>
      <Badge tone="success">Concluída</Badge>
      <Badge tone="info">Novo</Badge>
    </div>
  ),
};
