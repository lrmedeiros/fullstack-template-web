import type { Metadata } from "next";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import { AuthCard, AuthFooterLink, GoogleButton } from "@/components/templates/AuthCard";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Criar conta"
      subtitle="Leva menos de um minuto."
      footer={
        <>
          Já tem conta? <AuthFooterLink href="/login">Entrar</AuthFooterLink>
        </>
      }
    >
      <RegisterForm />
      <GoogleButton />
    </AuthCard>
  );
}
