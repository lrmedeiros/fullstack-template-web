import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

/**
 * O JWT da API fica num cookie httpOnly: o JavaScript do navegador não
 * consegue lê-lo (mitiga XSS), e só o servidor do Next o repassa à API.
 */
export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setSessionToken(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // alinhado ao JWT_EXPIRES_IN padrão da API (1h)
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
