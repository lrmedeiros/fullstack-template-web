import "server-only";

/** URL da API vista pelo servidor do Next (no Docker: http://api:3001/api). */
const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: unknown;
}

/**
 * Cliente HTTP do servidor para a API. Só roda no servidor ("server-only"),
 * então o token nunca precisa ser exposto ao navegador.
 */
export async function apiFetch<T>(
  path: string,
  { token, body, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(503, "Não foi possível conectar à API");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // Formato de erro padrão do NestJS: { statusCode, message, error }
    const message = (payload as { message?: string | string[] } | null)?.message;
    const details = Array.isArray(message) ? message : undefined;
    throw new ApiError(
      response.status,
      (Array.isArray(message) ? message[0] : message) ?? response.statusText,
      details,
    );
  }

  return payload as T;
}
