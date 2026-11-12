import Link from "next/link";
import { alaiaAnimals } from "@/lib/alaia-animals";
import { ChevronLeftIcon } from "../../icons";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;

export default function AnimalCreditsPage() {
  return (
    <main className="min-h-dvh bg-background px-md pb-[calc(var(--spacing-xl)+env(safe-area-inset-bottom))] pt-[calc(var(--spacing-md)+env(safe-area-inset-top))] sm:px-lg">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/alaia/animales"
          aria-label="Volver a Animales"
          className="flex size-11 items-center justify-center rounded-full bg-surface text-text-secondary shadow-sm transition hover:bg-surface-variant hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeftIcon />
        </Link>

        <header className="mt-lg text-center">
          <p className="text-label-sm uppercase text-primary">Animales</p>
          <h1 className="text-headline-lg">Créditos</h1>
          <p className="mx-auto mt-sm max-w-[36rem] text-body-md text-text-secondary">
            Los videos son material de stock de Pexels. Los sonidos provienen de
            Wikimedia Commons. Los signos provienen de la Fundación CNSE y
            conservan su licencia original.
          </p>
        </header>

        <div className="mt-xl flex flex-col gap-md">
          {alaiaAnimals.map((animal) => (
            <section
              key={animal.id}
              className="rounded-lg border border-border-subtle bg-surface p-md"
            >
              <h2 className="text-headline-sm text-text-primary">
                {animal.name}
              </h2>
              <dl className="mt-sm flex flex-col gap-sm text-body-sm">
                <div>
                  <dt className="text-label-sm uppercase text-text-secondary">
                    Video
                  </dt>
                  <dd className="mt-xs text-text-secondary">
                    <a
                      href={animal.sources.video.page}
                      {...externalLinkProps}
                      aria-label={`Video de ${animal.name} en ${animal.sources.video.provider} (abre en una pestaña nueva)`}
                      className="text-primary underline underline-offset-4"
                    >
                      {animal.sources.video.provider} ↗
                    </a>
                    <span>
                      {" "}
                      · {animal.sources.video.author} ·{" "}
                      {animal.sources.video.license}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-label-sm uppercase text-text-secondary">
                    Audio
                  </dt>
                  <dd className="mt-xs text-text-secondary">
                    <a
                      href={animal.sources.audio.page}
                      {...externalLinkProps}
                      aria-label={`Audio de ${animal.name} en Wikimedia Commons (abre en una pestaña nueva)`}
                      className="text-primary underline underline-offset-4"
                    >
                      {animal.sources.audio.title.replace(/^File:/, "")} ↗
                    </a>
                    <span>
                      {" "}
                      · {animal.sources.audio.author} ·{" "}
                      {animal.sources.audio.license}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-label-sm uppercase text-text-secondary">
                    Signo LSE
                  </dt>
                  <dd className="mt-xs text-text-secondary">
                    <a
                      href={animal.sign.source.page}
                      {...externalLinkProps}
                      aria-label={`Signo de ${animal.name} en ${animal.sign.source.provider} (abre en una pestaña nueva)`}
                      className="text-primary underline underline-offset-4"
                    >
                      {animal.sign.source.provider} ↗
                    </a>
                    <span>
                      {" "}
                      · {animal.sign.source.author} ·{" "}
                      {animal.sign.source.license}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
