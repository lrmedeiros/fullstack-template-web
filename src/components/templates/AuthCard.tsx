import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/organisms/Header";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Template das telas de login e cadastro. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <>
      <Header />
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
          {children}
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        </div>
      </main>
    </>
  );
}

export function GoogleButton() {
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
      </div>
      {/* Link comum (não <Link>): sai do app para o fluxo OAuth2 na API. */}
      <a
        href="/auth/google"
        className="flex h-10 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Continuar com Google
      </a>
    </>
  );
}

export function AuthFooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-primary hover:underline">
      {children}
    </Link>
  );
}
