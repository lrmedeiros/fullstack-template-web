/**
 * @jest-environment node
 */
import { fieldErrorsOf, loginSchema, registerSchema, taskSchema } from "./validation";

describe("validation schemas", () => {
  it("normalizes the email on login", () => {
    const result = loginSchema.parse({ email: "  Ada@Example.COM ", password: "x" });
    expect(result.email).toBe("ada@example.com");
  });

  it("enforces the same password rules as the API", () => {
    const result = registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "somenteletras",
    });

    expect(result.success).toBe(false);
    expect(fieldErrorsOf(result.error!).password).toEqual(["Use ao menos uma letra e um número"]);
  });

  it("accepts a valid registration", () => {
    expect(
      registerSchema.safeParse({ name: "Ada", email: "ada@example.com", password: "S3nhaForte" })
        .success,
    ).toBe(true);
  });

  it("trims the task title and drops an empty description", () => {
    expect(taskSchema.parse({ title: "  Revisar  ", description: "   " })).toEqual({
      title: "Revisar",
      description: undefined,
    });
  });

  it("rejects a blank task title", () => {
    const result = taskSchema.safeParse({ title: "   " });
    expect(fieldErrorsOf(result.error!).title).toEqual(["Informe um título"]);
  });
});
