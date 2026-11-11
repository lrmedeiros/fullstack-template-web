import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Roda o axe (addon-a11y) em cada story e mostra violações no painel.
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
