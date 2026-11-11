"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { requireToken } from "@/lib/dal";
import type { Task } from "@/lib/types";
import { fieldErrorsOf, taskSchema, taskStatusSchema, type FormState } from "@/lib/validation";

type TaskFields = { title: string; description: string };

export async function createTask(
  _prev: FormState<TaskFields>,
  formData: FormData,
): Promise<FormState<TaskFields>> {
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  try {
    await apiFetch<Task>("/tasks", {
      method: "POST",
      token: await requireToken(),
      body: parsed.data,
    });
  } catch (error) {
    handleAuthError(error);
    return { message: "Não foi possível criar a tarefa.", values };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: string): Promise<void> {
  const parsedStatus = taskStatusSchema.parse(status);
  try {
    await apiFetch<Task>(`/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      token: await requireToken(),
      body: { status: parsedStatus },
    });
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await apiFetch<void>(`/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE",
      token: await requireToken(),
    });
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
  revalidatePath("/dashboard");
}

function handleAuthError(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    redirect("/login?expired=1");
  }
}
