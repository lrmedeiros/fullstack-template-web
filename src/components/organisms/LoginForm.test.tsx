import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

// A Server Action real roda no servidor; aqui o componente recebe um dublê.
jest.mock("@/actions/auth", () => ({ login: jest.fn() }));

describe("LoginForm", () => {
  it("sends the typed credentials to the action", async () => {
    const action = jest.fn().mockResolvedValue({});
    render(<LoginForm action={action} />);

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Senha"), "S3nhaForte");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(action).toHaveBeenCalledTimes(1);
    const formData = action.mock.calls[0][1] as FormData;
    expect(formData.get("email")).toBe("ada@example.com");
    expect(formData.get("password")).toBe("S3nhaForte");
  });

  it("shows field errors returned by the action", async () => {
    const action = jest.fn().mockResolvedValue({
      fieldErrors: { email: ["Informe um email válido"] },
      values: { email: "invalido" },
    });
    render(<LoginForm action={action} />);

    await userEvent.type(screen.getByLabelText("Email"), "invalido");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const email = await screen.findByLabelText("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Informe um email válido");
    expect(email).toHaveValue("invalido");
  });

  it("announces a general error with role=alert", async () => {
    const action = jest.fn().mockResolvedValue({ message: "Email ou senha incorretos." });
    render(<LoginForm action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email ou senha incorretos.");
  });
});
