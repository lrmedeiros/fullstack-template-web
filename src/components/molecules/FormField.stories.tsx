import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField } from "./FormField";

const meta = {
  title: "Molecules/FormField",
  component: FormField,
  args: { label: "Email", name: "email", type: "email", placeholder: "voce@exemplo.com" },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    label: "Senha",
    name: "password",
    type: "password",
    placeholder: undefined,
    hint: "Mínimo de 8 caracteres, com letras e números.",
  },
};

export const WithError: Story = {
  args: { defaultValue: "invalido", errors: ["Informe um email válido"] },
};

export const Multiline: Story = {
  args: { label: "Descrição", name: "description", multiline: true, placeholder: undefined },
};
