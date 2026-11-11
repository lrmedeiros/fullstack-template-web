import { z } from "zod";

/**
 * Schemas compartilhados entre os formulários e as Server Actions.
 * As regras espelham os DTOs da API, então o usuário recebe o erro antes
 * da requisição — mas a API continua sendo a fonte da verdade.
 */

/** Normaliza (trim + minúsculas) antes de validar o formato. */
const emailField = z.string().trim().toLowerCase().pipe(z.email("Informe um email válido"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa ter ao menos 2 caracteres")
    .max(120, "O nome pode ter no máximo 120 caracteres"),
  email: emailField,
  password: z
    .string()
    .min(8, "A senha precisa ter ao menos 8 caracteres")
    .max(72, "A senha pode ter no máximo 72 caracteres")
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Use ao menos uma letra e um número"),
});

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Informe um título")
    .max(160, "O título pode ter no máximo 160 caracteres"),
  description: z
    .string()
    .trim()
    .max(2000, "A descrição pode ter no máximo 2000 caracteres")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export type FieldErrors<T> = Partial<Record<keyof T, string[]>>;

/** Estado devolvido pelas Server Actions para o `useActionState`. */
export interface FormState<T = Record<string, unknown>> {
  message?: string;
  fieldErrors?: FieldErrors<T>;
  /** Valores enviados, para repopular o formulário depois de um erro. */
  values?: Partial<Record<keyof T, string>>;
  success?: boolean;
}

export function fieldErrorsOf<T>(error: z.ZodError<T>): FieldErrors<T> {
  return z.flattenError(error).fieldErrors as FieldErrors<T>;
}
