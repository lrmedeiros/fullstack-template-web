import Link from "next/link";
import { Header } from "@/components/organisms/Header";

const FEATURES = [
  {
    title: "Autenticação segura",
    text: "JWT emitido pela API e guardado em cookie httpOnly; OAuth2 com Google pronto para ligar.",
  },
  {
    title: "Server Actions",
    text: "Formulários validados com Zod no servidor, com feedback acessível e estado otimista.",
  },
  {
    title: "Design system",
    text: "Componentes em Atomic Design com Tailwind CSS, tokens de tema e documentação no Storybook.",
  },
  {
    title: "Qualidade",
    text: "Jest e React Testing Library, ESLint, TypeScript estrito, CI no GitHub Actions e Docker.",
  },
];

const linkBase =
  "inline-flex h-11 items-center rounded-lg px-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function HomePage() {
  return (
    <>
      <Header>
        <Link href="/login" className="text-sm text-muted hover:text-foreground">
          Entrar
        </Link>
      </Header>
      <main id="main" className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 py-16">
        <section className="flex flex-col items-start gap-6">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Next.js · NestJS · PostgreSQL
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Um ponto de partida full stack, do login ao deploy.
          </h1>
          <p className="max-w-xl text-lg text-pretty text-muted">
            Gerencie tarefas numa aplicação de exemplo que mostra autenticação, CRUD com paginação,
            testes e uma arquitetura pronta para crescer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className={`${linkBase} bg-primary text-primary-foreground hover:bg-primary-hover`}
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className={`${linkBase} border border-border bg-surface hover:bg-background`}
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        <section aria-labelledby="features-title">
          <h2 id="features-title" className="sr-only">
            Recursos
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted">{feature.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
