import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./Alert";

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  args: { children: "Sua sessão expirou. Entre novamente." },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Error: Story = { args: { tone: "error", children: "Email ou senha incorretos." } };

export const Success: Story = { args: { tone: "success", children: "Tarefa criada." } };
