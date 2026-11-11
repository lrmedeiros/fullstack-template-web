import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./Pagination";

const meta = {
  title: "Organisms/Pagination",
  component: Pagination,
  args: { page: 2, totalPages: 5, hrefFor: (page: number) => `/dashboard?page=${page}` },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MiddlePage: Story = {};

export const FirstPage: Story = { args: { page: 1 } };

export const LastPage: Story = { args: { page: 5 } };
