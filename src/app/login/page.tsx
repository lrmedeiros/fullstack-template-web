import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/molecules/Alert";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthCard, AuthFooterLink, GoogleButton } from "@/components/templates/AuthCard";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua lista de tarefas."
      footer={
        <>
          Não tem conta? <AuthFooterLink href="/register">Cadastre-se</AuthFooterLink>
        </>
      }
    >
      <Suspense>
        <Notices searchParams={searchParams} />
      </Suspense>
      <LoginForm />
      <GoogleButton />
    </AuthCard>
  );
}

async function Notices({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const params = await searchParams;
  if (params.expired) {
    return <Alert className="mb-4">Sua sessão expirou. Entre novamente.</Alert>;
  }
  if (params.error === "oauth") {
    return (
      <Alert tone="error" className="mb-4">
        Não foi possível entrar com o Google.
      </Alert>
    );
  }
  return null;
}
