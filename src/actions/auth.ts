"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { clearSession, setSessionToken } from "@/lib/session";
import type { AuthResponse, User } from "@/lib/types";
import { fieldErrorsOf, loginSchema, registerSchema, type FormState } from "@/lib/validation";

type LoginFields = { email: string; password: string };
type RegisterFields = LoginFields & { name: string };

export async function login(
  _prev: FormState<LoginFields>,
  formData: FormData,
): Promise<FormState<LoginFields>> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  try {
    const { accessToken } = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: parsed.data,
    });
    await setSessionToken(accessToken);
  } catch (error) {
    return { message: authErrorMessage(error), values };
  }

  redirect("/dashboard");
}

export async function register(
  _prev: FormState<RegisterFields>,
  formData: FormData,
): Promise<FormState<RegisterFields>> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  try {
    const { accessToken } = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: parsed.data,
    });
    await setSessionToken(accessToken);
  } catch (error) {
    return { message: authErrorMessage(error), values };
  }

  redirect("/dashboard");
}

/**
 * Conclui o login OAuth2: a API redireciona para /auth/callback#token=...,
 * a página entrega o token aqui, e o servidor o valida antes de gravar o cookie.
 */
export async function completeOAuthLogin(token: string): Promise<{ error?: string }> {
  if (!token) {
    return { error: "Token ausente na resposta do provedor." };
  }
  try {
    await apiFetch<User>("/users/me", { token });
  } catch {
    return { error: "Não foi possível concluir o login. Tente novamente." };
  }
  await setSessionToken(token);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/login");
}

function authErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Erro inesperado. Tente novamente.";
  switch (error.status) {
    case 401:
      return "Email ou senha incorretos.";
    case 409:
      return "Este email já está cadastrado.";
    case 429:
      return "Muitas tentativas. Aguarde um minuto e tente de novo.";
    case 503:
      return "A API está indisponível no momento.";
    default:
      return error.message;
  }
}
