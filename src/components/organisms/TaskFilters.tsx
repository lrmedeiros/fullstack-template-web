import Link from "next/link";
import { cn } from "@/lib/cn";
import { TASK_STATUS_LABEL, type TaskStatus } from "@/lib/types";

interface TaskFiltersProps {
  status?: TaskStatus;
  search?: string;
}

const OPTIONS: { value?: TaskStatus; label: string }[] = [
  { label: "Todas" },
  ...Object.entries(TASK_STATUS_LABEL).map(([value, label]) => ({
    value: value as TaskStatus,
    label,
  })),
];

/** Filtros via query string: funcionam sem JavaScript e o link é compartilhável. */
export function TaskFilters({ status, search }: TaskFiltersProps) {
  const hrefFor = (value?: TaskStatus) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    if (search) params.set("search", search);
    const query = params.toString();
    return query ? `/dashboard?${query}` : "/dashboard";
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Filtrar por status" className="flex flex-wrap gap-1">
        {OPTIONS.map((option) => {
          const active = option.value === status;
          return (
            <Link
              key={option.label}
              href={hrefFor(option.value)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </nav>

      <form role="search" action="/dashboard" className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <label htmlFor="task-search" className="sr-only">
          Buscar tarefas
        </label>
        <input
          id="task-search"
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Buscar por título"
          className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-56"
        />
      </form>
    </div>
  );
}
