# Fullstack Template — Web

[![CI](https://github.com/lrmedeiros/fullstack-template-web/actions/workflows/ci.yml/badge.svg)](https://github.com/lrmedeiros/fullstack-template-web/actions/workflows/ci.yml)

> 🇺🇸 [Read in English](README.en.md)

Front-end em **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4**. Tem autenticação via JWT em cookie httpOnly, Server Actions validadas com Zod, componentes em **Atomic Design** documentados no **Storybook**, testes com **Jest + React Testing Library**, Docker e CI.

O back-end (NestJS + TypeORM + PostgreSQL) fica em **[fullstack-template-api](https://github.com/lrmedeiros/fullstack-template-api)**.

## Subir a stack completa em um comando

Pré-requisito: Docker. Clone os dois repositórios lado a lado:

```bash
git clone https://github.com/lrmedeiros/fullstack-template-api.git
git clone https://github.com/lrmedeiros/fullstack-template-web.git
cd fullstack-template-web
docker compose up --build
```

Se quiser clonar só este repositório, o Compose pode construir a API direto do GitHub:

```bash
API_CONTEXT=https://github.com/lrmedeiros/fullstack-template-api.git#main docker compose up --build
```

| Serviço  | URL                        |
| -------- | -------------------------- |
| Web      | http://localhost:3000      |
| API      | http://localhost:3001/api  |
| Swagger  | http://localhost:3001/docs |
| Postgres | `localhost:5432`           |

Crie uma conta em http://localhost:3000/register e comece a cadastrar tarefas.

## Rodar localmente

Com a API rodando (via `docker compose up` no repositório da API, ou `npm run start:dev` lá):

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
npm run storybook  # http://localhost:6006
```

## Funcionalidades

- Cadastro, login e logout. Login com Google (OAuth2) quando a API tem as credenciais configuradas.
- Rotas protegidas e redirecionamento automático quando a sessão expira.
- CRUD de tarefas com status, filtro, busca e paginação. Os filtros ficam na URL, então o link é compartilhável e funciona sem JavaScript.
- Atualização otimista de status (`useOptimistic`), com rollback e mensagem se a API falhar.
- Tema claro e escuro (segue o sistema operacional).

## Arquitetura e decisões

```
src/
├── app/                 # rotas (App Router): /, /login, /register, /dashboard, /auth/*
├── actions/             # Server Actions (auth e tarefas)
├── components/
│   ├── atoms/           # Button, Input, Label, Badge, Spinner
│   ├── molecules/       # FormField, Alert
│   ├── organisms/       # LoginForm, RegisterForm, TaskForm, TaskItem, TaskFilters, Pagination, Header
│   └── templates/       # AuthCard
├── lib/
│   ├── api.ts           # cliente HTTP server-only para a API
│   ├── dal.ts           # Data Access Layer: lê a sessão e busca dados do usuário
│   ├── session.ts       # cookie httpOnly com o JWT
│   ├── validation.ts    # schemas Zod compartilhados por formulários e actions
│   └── types.ts         # contrato da API
└── proxy.ts             # checagem otimista de sessão (o antigo middleware)
```

- **O token nunca chega ao navegador.** Login e cadastro são Server Actions que chamam a API e gravam o JWT num cookie `httpOnly` + `SameSite=Lax` (`Secure` em produção). Server Components e Actions repassam o token para a API. O JavaScript do cliente não consegue lê-lo, o que reduz o impacto de um XSS.
- **Duas camadas de proteção.** O `proxy.ts` faz uma checagem otimista (o cookie existe?) e redireciona cedo. A verificação de verdade fica na DAL, que valida o token na API a cada requisição. Um 401 leva a `/login?expired=1`, e lá o proxy limpa o cookie.
- **Cache Components e streaming.** Com `cacheComponents` ligado, tudo o que lê a requisição (cookie, `searchParams`) fica atrás de `<Suspense>`. O resto da página entra no shell estático e aparece na hora, e a lista de tarefas chega por streaming.
- **Formulários com Server Actions + `useActionState`.** A validação com Zod roda no servidor, com mensagens por campo, os valores preservados depois de um erro e o estado `pending` no botão. Os schemas espelham os DTOs da API, mas a API continua sendo a fonte da verdade.
- **Design system.** As cores são tokens semânticos em `globals.css` (`bg-surface`, `text-muted`, `bg-primary`...), com dark mode. Os componentes seguem Atomic Design e aceitam `className`, com `tailwind-merge` resolvendo conflitos. O Storybook roda o axe (addon-a11y) em cada story.
- **Acessibilidade.** `lang="pt-BR"`, link "pular para o conteúdo", labels associados, `aria-invalid` e `aria-describedby` nos campos com erro, `role="alert"` para erros, `aria-busy` em ações pendentes, foco visível em todos os controles e respeito a `prefers-reduced-motion`.
- **Configuração em tempo de execução.** `API_URL` e `API_PUBLIC_URL` são lidas no servidor durante a execução, não injetadas no build, então a mesma imagem Docker serve qualquer ambiente.
- **Imagem Docker enxuta.** `output: "standalone"` e build multi-stage com usuário não-root.

## Scripts

| Script                                  | O que faz                                    |
| --------------------------------------- | -------------------------------------------- |
| `npm run dev`                           | Servidor de desenvolvimento                  |
| `npm test` / `npm run test:cov`         | Jest + React Testing Library / com cobertura |
| `npm run lint` / `npm run typecheck`    | ESLint (regras do Next) / `tsc --noEmit`     |
| `npm run format` / `format:check`       | Prettier (com ordenação de classes Tailwind) |
| `npm run storybook` / `build-storybook` | Storybook dos componentes                    |
| `npm run build`                         | Build de produção                            |

## Qualidade e fluxo de trabalho

- **CI (GitHub Actions):** lint, formatação, typecheck, testes com cobertura, build do Next, build do Storybook e da imagem Docker, e validação de Conventional Commits nos PRs.
- **Husky + lint-staged:** ESLint e Prettier nos arquivos staged a cada commit.
- **Commitlint:** mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zod · Jest · React Testing Library · Storybook 10 · ESLint · Prettier · Docker · GitHub Actions · Husky · Commitlint

## Licença

[MIT](LICENSE) © Lucas Rinaldi Medeiros Silva
