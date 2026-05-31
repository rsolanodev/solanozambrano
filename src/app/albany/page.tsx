import Link from "next/link";
import { albanyApps, type AlbanyApp } from "@/lib/albany-apps";

function TensiometroLogo() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-24 sm:size-28"
      fill="none"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="20" fill="var(--color-primary-soft)" />
      <path
        d="M20.5 25.8C20.5 20.9 24.3 17 29 17c2.9 0 5.3 1.3 7 3.5 1.7-2.2 4.1-3.5 7-3.5 4.7 0 8.5 3.9 8.5 8.8 0 9.8-15.5 18.7-15.5 18.7S20.5 35.6 20.5 25.8Z"
        fill="var(--color-primary)"
      />
      <path
        d="M14 36h10l3.2-6.5 5.5 13 4.8-10.2 3.2 3.7H50"
        stroke="var(--color-success)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlbanyAppCard({ app }: { app: AlbanyApp }) {
  return (
    <Link
      href={app.href}
      aria-label={`Entrar en ${app.name}`}
      className="group flex w-36 flex-col items-center gap-sm rounded-md p-sm text-center outline-none transition duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-40"
    >
      <span className="rounded-lg border border-border-subtle bg-surface p-sm shadow-[0_16px_40px_rgba(255,138,165,0.18)] transition duration-200 group-hover:border-primary group-focus-visible:border-primary">
        <TensiometroLogo />
      </span>
      <span className="text-headline-sm text-text-primary">{app.name}</span>
    </Link>
  );
}

export default function AlbanyAppsPage() {
  return (
    <main className="min-h-screen px-lg py-xl">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col gap-xl">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-xs rounded-full bg-surface px-md py-sm text-body-sm text-text-secondary transition hover:bg-surface-variant hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Perfiles
          </Link>
        </div>

        <header className="text-center">
          <p className="text-label-sm uppercase text-primary">Albany</p>
          <h1 className="mt-xs text-headline-lg">Apps</h1>
        </header>

        <div className="flex flex-1 items-center justify-center">
          {albanyApps.map((app) => (
            <AlbanyAppCard key={app.key} app={app} />
          ))}
        </div>
      </section>
    </main>
  );
}
