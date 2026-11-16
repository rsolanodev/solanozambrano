"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { alaiaAnimals } from "@/lib/alaia-animals";
import { BackButton } from "@/components/BackButton";
import { Marker } from "@/components/Marker";
import { PageDoodles } from "@/components/PageDoodles";
import AnimalCard from "./AnimalCard";
import AnimalPlayer from "./AnimalPlayer";
import type { AudioState } from "./types";
import { ChevronRightIcon } from "../icons";
import classes from "./animals.module.css";

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
    <Box component="main" className={classes.main}>
      <PageDoodles variant="animals" />

      <Box
        inert={openIndex !== null}
        className={classes.content}
      >
        <Container size={1180} className={classes.inner}>
          <Box component="header" className={classes.topbar}>
            <BackButton href="/alaia" label="Volver a Mundo de Alaia">
              Mundo de Alaia
            </BackButton>
            <Badge color="sun" variant="light" size="md" className={classes.count}>
              {alaiaAnimals.length} amigos
            </Badge>
          </Box>

          <Box className={classes.hero}>
            <Text className="text-label" c="var(--color-coral-strong)">
              Mundo de Alaia
            </Text>
            <Title order={1} className={classes.title}>
              <Marker>Animales</Marker>
            </Title>
            <Text component="p" className={classes.intro}>
              Toca un animal para verlo y escucharlo.
            </Text>
          </Box>

          <SimpleGrid
            cols={{ base: 2, sm: 3, lg: 4 }}
            spacing={{ base: "md", lg: "lg" }}
            className={classes.grid}
          >
            {alaiaAnimals.map((animal, index) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                index={index}
                priority={index < 4}
                onSelect={(trigger) => openAnimal(index, trigger)}
              />
            ))}
          </SimpleGrid>

          <Box component="footer" className={classes.footer}>
            <Button
              component={Link}
              href="/alaia/animales/creditos"
              variant="default"
              rightSection={<ChevronRightIcon size={16} />}
              className={classes.creditsLink}
            >
              Créditos y fuentes
            </Button>
          </Box>
        </Container>
      </Box>

      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setAudioState("playing")}
        onPause={() =>
          setAudioState((state) => (state === "playing" ? "idle" : state))
        }
        onEnded={() => setAudioState("idle")}
        onError={() => setAudioState("error")}
        className={classes.audio}
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
    </Box>
  );
}