"use client";

import { useOptimistic, useState, useTransition } from "react";
import { deleteTask, updateTaskStatus } from "@/actions/tasks";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";
import { TASK_STATUS_LABEL, type Task, type TaskStatus } from "@/lib/types";

const STATUS_TONE = { todo: "neutral", in_progress: "warning", done: "success" } as const;

interface TaskItemProps {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function TaskItem({
  task,
  onStatusChange = updateTaskStatus,
  onDelete = deleteTask,
}: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  // Atualização otimista: o status muda na hora e volta se a API falhar.
  const [status, setOptimisticStatus] = useOptimistic(task.status);
  const selectId = `status-${task.id}`;

  function changeStatus(next: TaskStatus) {
    setError(undefined);
    startTransition(async () => {
      setOptimisticStatus(next);
      try {
        await onStatusChange(task.id, next);
      } catch {
        setError("Não foi possível atualizar a tarefa.");
      }
    });
  }

  function remove() {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    setError(undefined);
    startTransition(async () => {
      try {
        await onDelete(task.id);
      } catch {
        setError("Não foi possível excluir a tarefa.");
      }
    });
  }

  return (
    <li
      aria-busy={isPending || undefined}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-start",
        isPending && "opacity-70",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "font-medium break-words",
              status === "done" && "text-muted line-through",
            )}
          >
            {task.title}
          </h3>
          <Badge tone={STATUS_TONE[status]}>{TASK_STATUS_LABEL[status]}</Badge>
        </div>
        {task.description && (
          <p className="mt-1 text-sm break-words whitespace-pre-line text-muted">
            {task.description}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={selectId} className="sr-only">
          Status de {task.title}
        </label>
        <select
          id={selectId}
          value={status}
          disabled={isPending}
          onChange={(event) => changeStatus(event.target.value as TaskStatus)}
          className="h-8 rounded-lg border border-border bg-surface px-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="sm"
          onClick={remove}
          disabled={isPending}
          aria-label={`Excluir ${task.title}`}
        >
          Excluir
        </Button>
      </div>
    </li>
  );
}
