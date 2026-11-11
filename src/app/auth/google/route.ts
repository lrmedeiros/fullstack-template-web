import { connection, NextResponse } from "next/server";

/**
 * Encaminha para o início do fluxo OAuth2 na API. A URL pública da API é
 * lida em tempo de execução (não no build), então a mesma imagem Docker
 * serve qualquer ambiente.
 */
export async function GET() {
  await connection();
  const apiPublicUrl = process.env.API_PUBLIC_URL ?? "http://localhost:3001/api";
  return NextResponse.redirect(`${apiPublicUrl}/auth/google`);
}
