"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/molecules/Alert";
import { FormField } from "@/components/molecules/FormField";
import type { FormState } from "@/lib/validation";

type Fields = { name: string; email: string; password: string };

interface RegisterFormProps {
  action?: typeof register;
}

export function RegisterForm({ action = register }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState<FormState<Fields>, FormData>(action, {});

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state.message && <Alert tone="error">{state.message}</Alert>}
      <FormField
        label="Nome"
        name="name"
        autoComplete="name"
        required
        defaultValue={state.values?.name}
        errors={state.fieldErrors?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
      />
      <FormField
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="Mínimo de 8 caracteres, com letras e números."
        required
        errors={state.fieldErrors?.password}
      />
      <Button type="submit" loading={pending} className="mt-2 w-full">
        Criar conta
      </Button>
    </form>
  );
}
