import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  error: "border-danger/30 bg-danger-soft text-danger",
  success: "border-success/30 bg-success-soft text-success",
  info: "border-primary/30 bg-primary/10 text-primary",
} as const;

interface AlertProps {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}

/** Mensagem de feedback. Erros usam role="alert" para serem anunciados na hora. */
export function Alert({ tone = "info", children, className }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone], className)}
    >
      {children}
    </div>
  );
}
