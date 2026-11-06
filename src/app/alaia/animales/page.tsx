"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { alaiaAnimals } from "@/lib/alaia-animals";
import AnimalCard from "./AnimalCard";
import AnimalPlayer from "./AnimalPlayer";
import type { AudioState } from "./types";
import { ChevronLeftIcon } from "../icons";

export default function AnimalsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const openIndexRef = useRef<number | null>(null);
  const playRequestRef = useRef(0);

  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  const startAudio = useCallback((index: number) => {
    const animal = alaiaAnimals[index];
    const audio = audioRef.current;
    if (!animal || !audio) return;

    const requestId = ++playRequestRef.current;
    const currentSource = audio.getAttribute("src");
    audio.pause();
    setAudioState("idle");

    if (currentSource !== animal.audio) {
      audio.src = animal.audio;
      audio.load();
    } else {
      try {
        audio.currentTime = 0;
      } catch {
        // Some browsers do not allow seeking before metadata is ready.
      }
    }

    const playPromise = audio.play();
    playPromise?.catch(() => {
      if (requestId === playRequestRef.current) {
        setAudioState("error");
      }
    });
  }, []);

  const openAnimal = useCallback(
    (index: number, trigger: HTMLButtonElement) => {
      const animal = alaiaAnimals[index];
      if (!animal) return;

      lastTriggerRef.current = trigger;
      setOpenIndex(index);
      startAudio(index);

      if (typeof window === "undefined") return;
      const state = { alaiaPlayer: true, animal: animal.id };
      const hash = `#${animal.id}`;
      if (window.history.state?.alaiaPlayer) {
        window.history.replaceState(state, "", hash);
      } else {
        window.history.pushState(state, "", hash);
      }
    },
    [startAudio]
  );

  const changeAnimal = useCallback(
    (delta: number) => {
      if (openIndex === null) return;
      const nextIndex =
        (openIndex + delta + alaiaAnimals.length) % alaiaAnimals.length;
      const animal = alaiaAnimals[nextIndex];
      setOpenIndex(nextIndex);
      startAudio(nextIndex);

      if (typeof window !== "undefined" && animal) {
        window.history.replaceState(
          { alaiaPlayer: true, animal: animal.id },
          "",
          `#${animal.id}`
        );
      }
    },
    [openIndex, startAudio]
  );

  const replay = useCallback(() => {
    if (openIndex !== null) startAudio(openIndex);
  }, [openIndex, startAudio]);

  const closePlayer = useCallback((options?: { skipHistory?: boolean }) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // Ignore seeking errors on unloaded media.
      }
    }

    setOpenIndex(null);
    setAudioState("idle");

    if (!options?.skipHistory && typeof window !== "undefined") {
      if (window.history.state?.alaiaPlayer) {
        window.history.back();
      } else {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  }, []);

  useEffect(() => {
    if (openIndex === null && lastTriggerRef.current) {
      lastTriggerRef.current.focus();
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex]);

  useEffect(() => {
    const handlePopState = () => {
      if (openIndexRef.current !== null) {
        closePlayer({ skipHistory: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closePlayer]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const currentAnimal = openIndex === null ? null : alaiaAnimals[openIndex];

  return (
    <main className="min-h-dvh bg-background text-text-primary">
      <div
        inert={openIndex !== null}
        className="min-h-dvh px-md pb-[calc(var(--spacing-xl)+env(safe-area-inset-bottom))] pt-[calc(var(--spacing-md)+env(safe-area-inset-top))] sm:px-lg"
      >
        <div className="mx-auto w-full max-w-5xl">
          <header className="flex items-center justify-between gap-md">
            <Link
              href="/alaia"
              aria-label="Volver a Mundo de Alaia"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary shadow-sm transition hover:bg-surface-variant hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeftIcon />
            </Link>
            <div className="flex-1 text-center">
              <p className="text-label-sm uppercase text-primary">
                Mundo de Alaia
              </p>
              <h1 className="text-headline-lg">Animales</h1>
            </div>
            <span className="size-11 shrink-0" aria-hidden="true" />
          </header>

          <p className="mt-sm text-center text-body-sm text-text-secondary">
            Toca un animal para verlo y escucharlo.
          </p>

          <div className="mt-lg grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-4">
            {alaiaAnimals.map((animal, index) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                priority={index < 4}
                onSelect={(trigger) => openAnimal(index, trigger)}
              />
            ))}
          </div>

          <footer className="mt-xl flex justify-center pb-sm">
            <Link
              href="/alaia/animales/creditos"
              className="inline-flex min-h-11 items-center text-label-sm text-text-secondary underline-offset-4 transition hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Créditos
            </Link>
          </footer>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setAudioState("playing")}
        onPause={() =>
          setAudioState((state) => (state === "playing" ? "idle" : state))
        }
        onEnded={() => setAudioState("idle")}
        onError={() => setAudioState("error")}
        className="hidden"
      />

      {currentAnimal && openIndex !== null ? (
        <AnimalPlayer
          animal={currentAnimal}
          index={openIndex}
          total={alaiaAnimals.length}
          audioState={audioState}
          onReplay={replay}
          onPrevious={() => changeAnimal(-1)}
          onNext={() => changeAnimal(1)}
          onClose={() => closePlayer()}
        />
      ) : null}
    </main>
  );
}
