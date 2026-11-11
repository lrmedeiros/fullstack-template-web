import type { Metadata } from "next";
import { Suspense } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/atoms/Button";
import { Header } from "@/components/organisms/Header";
import { Pagination } from "@/components/organisms/Pagination";
import { TaskFilters } from "@/components/organisms/TaskFilters";
import { TaskForm } from "@/components/organisms/TaskForm";
import { TaskItem } from "@/components/organisms/TaskItem";
import { getCurrentUser, getTasks } from "@/lib/dal";
import type { TaskStatus } from "@/lib/types";
import { taskStatusSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Minhas tarefas" };

/**
 * Com Cache Components, tudo que lê a requisição (cookie, searchParams)
 * fica atrás de <Suspense>: o resto da página vai no shell estático e
 * aparece na hora, e os dados do usuário chegam por streaming.
 */
export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <>
      <Header>
        <Suspense fallback={<span className="h-4 w-24 animate-pulse rounded bg-border" />}>
          <UserMenu />
        </Suspense>
      </Header>
      <main id="main" className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Minhas tarefas</h1>
        <TaskForm />
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskSection searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function UserMenu() {
  const user = await getCurrentUser();
  return (
    <>
      <span className="hidden text-sm text-muted sm:inline">
        Olá, <span className="font-medium text-foreground">{user.name}</span>
      </span>
      <form action={logout}>
        <Button type="submit" variant="secondary" size="sm">
          Sair
        </Button>
      </form>
    </>
  );
}

async function TaskSection({ searchParams }: Pick<PageProps<"/dashboard">, "searchParams">) {
  const params = await searchParams;
  const status = taskStatusSchema.safeParse(params.status).data as TaskStatus | undefined;
  const search = typeof params.search === "string" ? params.search.trim() : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const { data: tasks, meta } = await getTasks({ page, status, search });

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    query.set("page", String(target));
    return `/dashboard?${query.toString()}`;
  };

  return (
    <section aria-labelledby="tasks-title" className="flex flex-col gap-4">
      <h2 id="tasks-title" className="sr-only">
        Lista de tarefas
      </h2>
      <TaskFilters status={status} search={search} />
      <p className="text-sm text-muted" aria-live="polite">
        {meta.total === 1 ? "1 tarefa" : `${meta.total} tarefas`}
      </p>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          {status || search
            ? "Nenhuma tarefa encontrada com esses filtros."
            : "Nenhuma tarefa ainda. Que tal criar a primeira?"}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskItem key={`${task.id}-${task.updatedAt}`} task={task} />
          ))}
        </ul>
      )}
      <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={hrefFor} />
    </section>
  );
}

function TaskListSkeleton() {
  return (
    <div role="status" aria-label="Carregando tarefas" className="flex flex-col gap-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}
