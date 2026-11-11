"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/molecules/Alert";
import { FormField } from "@/components/molecules/FormField";
import type { FormState } from "@/lib/validation";

type Fields = { title: string; description: string };

interface TaskFormProps {
  action?: typeof createTask;
}

export function TaskForm({ action = createTask }: TaskFormProps) {
  const [state, formAction, pending] = useActionState<FormState<Fields>, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Limpa o formulário depois de criar e devolve o foco ao título.
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      formRef.current?.querySelector<HTMLInputElement>("input[name=title]")?.focus();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      aria-label="Nova tarefa"
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
    >
      {state.message && <Alert tone="error">{state.message}</Alert>}
      <FormField
        label="Título"
        name="title"
        placeholder="Ex.: Revisar pull request"
        maxLength={160}
        required
        defaultValue={state.values?.title}
        errors={state.fieldErrors?.title}
      />
      <FormField
        label="Descrição (opcional)"
        name="description"
        multiline
        maxLength={2000}
        defaultValue={state.values?.description}
        errors={state.fieldErrors?.description}
      />
      <Button type="submit" loading={pending} className="self-end">
        Adicionar tarefa
      </Button>
    </form>
  );
}
