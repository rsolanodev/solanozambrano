"use client";

import { useEffect, useRef, useState } from "react";
import type { Animal } from "@/lib/alaia-animals";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SpeakerIcon } from "../icons";
import type { AudioState } from "./types";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type AnimalPlayerProps = {
  animal: Animal;
  index: number;
  total: number;
  audioState: AudioState;
  onReplay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

function articleLabel(animal: Animal): string {
  return animal.article === "la" ? "la" : "el";
}

function SoundBars() {
  return (
    <span className="flex h-6 items-end gap-1" aria-hidden="true">
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className="alaia-sound-bar h-6 w-1.5 rounded-full bg-primary"
          style={{ animationDelay: `${bar * 110}ms` }}
        />
      ))}
    </span>
  );
}

function AnimalMedia({
  animal,
  reducedMotion,
  onReplay,
}: {
  animal: Animal;
  reducedMotion: boolean;
  onReplay: () => void;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="relative w-full max-w-[min(88vw,32rem)] overflow-hidden rounded-lg bg-surface shadow-[0_24px_60px_rgba(36,28,58,0.18)] landscape:w-[min(48vw,70vh)]">
      {reducedMotion || videoFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={animal.poster}
          alt={`${animal.name} en su hábitat`}
          width={720}
          height={720}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <video
          src={animal.video}
          poster={animal.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
          className="aspect-square size-full object-cover"
        />
      )}
      <button
        type="button"
        onClick={onReplay}
        aria-label={`Repetir sonido de ${articleLabel(animal)} ${animal.name}`}
        className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
      />
    </div>
  );
}

export default function AnimalPlayer({
  animal,
  index,
  total,
  audioState,
  onReplay,
  onPrevious,
  onNext,
  onClose,
}: AnimalPlayerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }

      if (
        event.key === " " &&
        !(event.target instanceof HTMLButtonElement) &&
        !(event.target instanceof HTMLAnchorElement)
      ) {
        event.preventDefault();
        onReplay();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious, onReplay]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="animal-player-title"
      aria-describedby="animal-player-sound"
      className="alaia-player-enter fixed inset-0 z-50 overflow-y-auto bg-background px-md pb-[calc(var(--spacing-lg)+env(safe-area-inset-bottom))] pt-[calc(var(--spacing-md)+env(safe-area-inset-top))] text-text-primary sm:px-lg"
    >
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col">
        <header className="flex items-center justify-between gap-md">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar reproductor"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm transition hover:bg-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CloseIcon className="size-6" />
          </button>
          <p
            aria-live="polite"
            className="rounded-full bg-surface px-md py-xs text-label-sm tabular-nums text-text-secondary"
          >
            {index + 1} de {total}
          </p>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-lg py-md landscape:flex-row landscape:gap-xl">
          <AnimalMedia
            key={animal.id}
            animal={animal}
            reducedMotion={reducedMotion}
            onReplay={onReplay}
          />

          <div className="flex w-full max-w-[28rem] flex-col items-center gap-md text-center">
            <div>
              <h2
                id="animal-player-title"
                className="text-display text-text-primary"
              >
                {animal.name}
              </h2>
              <div className="mt-xs flex min-h-8 items-center justify-center gap-sm">
                <p
                  id="animal-player-sound"
                  className="text-headline-md text-primary"
                >
                  {animal.sound}
                </p>
                {audioState === "playing" ? <SoundBars /> : null}
              </div>
            </div>

            {audioState === "error" ? (
              <p className="text-body-sm text-text-secondary">
                No se pudo reproducir. Toca para escuchar.
              </p>
            ) : null}

            <div className="flex w-full items-center justify-center gap-sm sm:gap-md">
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Animal anterior"
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface text-text-primary shadow-[0_10px_24px_rgba(36,28,58,0.12)] transition hover:bg-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeftIcon className="size-6" />
              </button>

              <button
                type="button"
                onClick={onReplay}
                className="btn-primary h-16 min-w-0 flex-1 gap-sm px-md text-headline-sm"
              >
                <SpeakerIcon className="size-6" />
                <span>
                  {audioState === "error" ? "Toca para escuchar" : "Otra vez"}
                </span>
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="Animal siguiente"
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface text-text-primary shadow-[0_10px_24px_rgba(36,28,58,0.12)] transition hover:bg-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
