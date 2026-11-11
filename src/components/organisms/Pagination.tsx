import Link from "next/link";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Monta o href de uma página preservando os filtros atuais. */
  hrefFor: (page: number) => string;
}

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkClass = (disabled: boolean) =>
    cn(
      "rounded-lg border border-border px-3 py-1.5 text-sm",
      disabled ? "pointer-events-none opacity-50" : "hover:bg-surface",
    );

  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-2">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={linkClass(page <= 1)}
      >
        Anterior
      </Link>
      <span className="text-sm text-muted">
        Página {page} de {totalPages}
      </span>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={linkClass(page >= totalPages)}
      >
        Próxima
      </Link>
    </nav>
  );
}
