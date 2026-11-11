import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("associates the label with the input", () => {
    render(<FormField label="Email" name="email" type="email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("exposes hint and error to assistive technology", () => {
    render(
      <FormField
        label="Senha"
        name="password"
        hint="Mínimo de 8 caracteres"
        errors={["A senha é curta demais", "outro erro"]}
      />,
    );

    const input = screen.getByLabelText("Senha");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Mínimo de 8 caracteres A senha é curta demais");
    // Só a primeira mensagem é exibida.
    expect(screen.queryByText("outro erro")).not.toBeInTheDocument();
  });

  it("renders a textarea when multiline", () => {
    render(<FormField label="Descrição" name="description" multiline />);
    expect(screen.getByLabelText("Descrição").tagName).toBe("TEXTAREA");
  });
});
