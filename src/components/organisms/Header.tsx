import Link from "next/link";
import type { ReactNode } from "react";

/** Cabeçalho do app. O conteúdo à direita (usuário, ações) vem por children. */
export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="rounded font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span aria-hidden="true" className="text-primary">
            ◆{" "}
          </span>
          Fullstack Template
        </Link>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
