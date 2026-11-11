import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { apiFetch, ApiError } from "./api";
import { getSessionToken } from "./session";
import type { Paginated, Task, TaskStatus, User } from "./types";

/**
 * Data Access Layer: único lugar que lê a sessão e fala com a API em nome
 * do usuário. A checagem do proxy.ts é só otimista; a verificação real
 * acontece aqui, a cada requisição.
 */

export const requireToken = cache(async (): Promise<string> => {
  const token = await getSessionToken();
  if (!token) redirect("/login");
  return token;
});

async function withAuth<T>(request: (token: string) => Promise<T>): Promise<T> {
  const token = await requireToken();
  try {
    return await request(token);
  } catch (error) {
    // Token expirado ou inválido: volta para o login, que limpa o cookie.
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?expired=1");
    }
    throw error;
  }
}

export const getCurrentUser = cache((): Promise<User> =>
  withAuth((token) => apiFetch<User>("/users/me", { token })),
);

export interface TaskFilters {
  page?: number;
  status?: TaskStatus;
  search?: string;
}

export function getTasks({ page = 1, status, search }: TaskFilters = {}) {
  const params = new URLSearchParams({ page: String(page), limit: "10" });
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  return withAuth((token) => apiFetch<Paginated<Task>>(`/tasks?${params.toString()}`, { token }));
}
