"use client";

import { Button } from "@/components/atoms/Button";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <main
      id="main"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted">Não foi possível carregar esta página. A API está no ar?</p>
      <Button onClick={() => retry()}>Tentar de novo</Button>
    </main>
  );
}
