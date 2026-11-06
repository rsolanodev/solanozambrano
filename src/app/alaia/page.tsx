import Link from "next/link";
import { alaiaApps } from "@/lib/alaia-apps";
import { alaiaAnimalCount } from "@/lib/alaia-animals";
import AnimalesLogo from "./AnimalesLogo";
import { ChevronLeftIcon } from "./icons";

export default function AlaiaLauncherPage() {
  return (
    <main className="min-h-dvh bg-background px-lg pb-[calc(var(--spacing-xl)+env(safe-area-inset-bottom))] pt-[calc(var(--spacing-lg)+env(safe-area-inset-top))]">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col gap-xl">
        <div>
          <Link
            href="/"
            aria-label="Volver a perfiles"
            className="inline-flex min-h-11 items-center gap-xs rounded-full bg-surface px-md py-sm text-body-sm text-text-secondary transition hover:bg-surface-variant hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeftIcon className="size-4" />
            Perfiles
          </Link>
        </div>

        <header className="text-center">
          <p className="text-label-sm uppercase text-primary">Alaia</p>
          <h1 className="mt-xs text-headline-lg">Mundo de Alaia</h1>
          <p className="mt-sm text-body-md text-text-secondary">
            Un lugar para descubrir, tocar y escuchar.
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center">
          {alaiaApps.map((app) => (
            <Link
              key={app.key}
              href={app.href}
              aria-label={`Entrar en ${app.name}`}
              className="group flex w-full max-w-[24rem] flex-col items-center gap-md rounded-lg border border-border-subtle bg-surface px-lg py-xl text-center shadow-[0_24px_60px_rgba(124,58,237,0.14)] outline-none transition duration-200 hover:-translate-y-1 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
            >
              <AnimalesLogo className="size-36 transition duration-200 group-hover:scale-[1.03] sm:size-40" />
              <span className="text-headline-lg text-text-primary">
                {app.name}
              </span>
              <span className="text-body-sm text-text-secondary">
                {app.description}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-soft px-md py-xs text-label-sm text-primary">
                {alaiaAnimalCount} animales
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
