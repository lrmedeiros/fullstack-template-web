# Fullstack Template — Web

[![CI](https://github.com/lrmedeiros/fullstack-template-web/actions/workflows/ci.yml/badge.svg)](https://github.com/lrmedeiros/fullstack-template-web/actions/workflows/ci.yml)

> 🇧🇷 [Leia em português](README.md)

Front end built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4**. It has JWT authentication in an httpOnly cookie, Server Actions validated with Zod, **Atomic Design** components documented in **Storybook**, tests with **Jest + React Testing Library**, Docker, and CI.

The back end (NestJS + TypeORM + PostgreSQL) lives in **[fullstack-template-api](https://github.com/lrmedeiros/fullstack-template-api)**.

## One-command full stack

Requires Docker. Clone both repositories side by side:

```bash
git clone https://github.com/lrmedeiros/fullstack-template-api.git
git clone https://github.com/lrmedeiros/fullstack-template-web.git
cd fullstack-template-web
docker compose up --build
```

To clone only this repository, Compose can build the API straight from GitHub:

```bash
API_CONTEXT=https://github.com/lrmedeiros/fullstack-template-api.git#main docker compose up --build
```

Web: http://localhost:3000 · API: http://localhost:3001/api · Swagger: http://localhost:3001/docs

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000 (needs the API running)
npm run storybook  # http://localhost:6006
```

## Architecture and decisions

- **The token never reaches the browser.** Login and sign-up are Server Actions that call the API and store the JWT in an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production). Client-side JavaScript can't read it.
- **Two layers of protection.** `proxy.ts` (formerly middleware) does an optimistic cookie check and redirects early. The Data Access Layer validates the token against the API on every request, and a 401 sends the user to `/login?expired=1`, where the proxy clears the cookie.
- **Cache Components and streaming.** Anything that reads the request sits behind `<Suspense>`. The rest of the page is part of the static shell, and the task list streams in.
- **Forms with Server Actions + `useActionState`.** Zod validates on the server, with per-field errors, values kept after an error, and a pending state on the button.
- **Design system.** Colors are semantic tokens with dark mode. Components follow Atomic Design, and Storybook runs axe (addon-a11y) on every story.
- **Accessibility.** Skip link, associated labels, `aria-invalid` and `aria-describedby` on fields with errors, `role="alert"` for errors, `aria-busy` on pending actions, visible focus on every control, and support for reduced motion.
- **Runtime configuration.** `API_URL` and `API_PUBLIC_URL` are read on the server at runtime, so one Docker image works in any environment. The image uses `output: "standalone"`, a multi-stage build, and a non-root user.

## Scripts

`dev`, `build`, `test`, `test:cov`, `lint`, `typecheck`, `format`, `format:check`, `storybook`, `build-storybook`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zod · Jest · React Testing Library · Storybook 10 · ESLint · Prettier · Docker · GitHub Actions · Husky · Commitlint

## License

[MIT](LICENSE) © Lucas Rinaldi Medeiros Silva
