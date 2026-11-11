"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { completeOAuthLogin } from "@/actions/auth";
import { Spinner } from "@/components/atoms/Spinner";

/**
 * Destino do redirect OAuth2 da API (/auth/callback#token=...).
 * O token chega no fragmento, que só o navegador enxerga; a página o entrega
 * a uma Server Action, que valida na API e grava o cookie httpOnly.
 */
export default function OAuthCallbackPage() {
  const [error, setError] = useState<string>();

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    // Tira o token da barra de endereço e do histórico.
    window.history.replaceState(null, "", window.location.pathname);

    completeOAuthLogin(token ?? "").then((result) => {
      if (result?.error) setError(result.error);
    });
  }, []);

  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
      {error ? (
        <>
          <p role="alert" className="text-danger">
            {error}
          </p>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Voltar para o login
          </Link>
        </>
      ) : (
        <p role="status" className="flex items-center gap-2 text-muted">
          <Spinner /> Concluindo login…
        </p>
      )}
    </main>
  );
}
