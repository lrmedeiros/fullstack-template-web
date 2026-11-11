import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center"
    >
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link href="/" className="text-sm text-primary hover:underline">
        Voltar para o início
      </Link>
    </main>
  );
}
