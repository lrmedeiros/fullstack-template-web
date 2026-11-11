"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/molecules/Alert";
import { FormField } from "@/components/molecules/FormField";
import type { FormState } from "@/lib/validation";

type Fields = { email: string; password: string };

interface LoginFormProps {
  action?: typeof login;
}

export function LoginForm({ action = login }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<FormState<Fields>, FormData>(action, {});

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state.message && <Alert tone="error">{state.message}</Alert>}
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
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />
      <Button type="submit" loading={pending} className="mt-2 w-full">
        Entrar
      </Button>
    </form>
  );
}
