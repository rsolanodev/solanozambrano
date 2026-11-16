"use client";

import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Image,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import type { Animal } from "@/lib/alaia-animals";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  HandIcon,
  SpeakerIcon,
} from "../icons";
import { LoopDoodle, SunDoodle } from "@/components/CrayonDoodles";
import { Marker } from "@/components/Marker";
import type { AudioState } from "./types";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import classes from "./AnimalPlayer.module.css";

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
    <Box component="span" className={classes.soundBars} aria-hidden="true">
      {[0, 1, 2, 3].map((bar) => (
        <Box
          component="span"
          key={bar}
          className={`alaia-sound-bar ${classes.soundBar}`}
          style={{ animationDelay: `${bar * 110}ms` }}
        />
      ))}
    </Box>
  );
}

function AnimalMedia({
  animal,
  reducedMotion,
  showSign,
  onReplay,
}: {
  animal: Animal;
  reducedMotion: boolean;
  showSign: boolean;
  onReplay: () => void;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <Box className={`${classes.media} ${showSign ? "" : classes.mediaWide}`}>
      <Box className={classes.mediaInner}>
        {showSign ? (
          <Box className={classes.signCard}>
            <Image
              src={animal.sign.image}
              alt={animal.sign.alt}
              width={960}
              height={480}
              fit="contain"
              className={classes.signImage}
            />
            <Text
              size="xs"
              c="dimmed"
              ta="center"
              className={classes.signCaption}
            >
              Así se dice en LSE
            </Text>
          </Box>
        ) : reducedMotion || videoFailed ? (
          <Image
            src={animal.poster}
            alt={`${animal.name} en su hábitat`}
            width={720}
            height={720}
            fit="cover"
            className={classes.poster}
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
            className={classes.video}
          />
        )}
        <UnstyledButton
          onClick={onReplay}
          aria-label={`Repetir sonido de ${articleLabel(animal)} ${animal.name}`}
          className={classes.overlay}
        />
      </Box>
    </Box>
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
  const [signAnimalId, setSignAnimalId] = useState<string | null>(null);
  const showSign = signAnimalId === animal.id;

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
    <Box
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="animal-player-title"
      aria-describedby="animal-player-sound"
      className={`alaia-player-enter ${classes.dialog}`}
    >
      <Box className={classes.doodleTop} aria-hidden="true">
        <SunDoodle />
      </Box>
      <Box className={classes.doodleBottom} aria-hidden="true">
        <LoopDoodle />
      </Box>

      <Box className={classes.inner}>
        <Box className={classes.header}>
          <ActionIcon
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar reproductor"
            size={48}
            className={classes.close}
          >
            <CloseIcon size={22} />
          </ActionIcon>

          <Text
            component="p"
            aria-live="polite"
            className={classes.counter}
          >
            {index + 1} de {total}
          </Text>
        </Box>

        <Box className={classes.body}>
          <AnimalMedia
            key={animal.id}
            animal={animal}
            reducedMotion={reducedMotion}
            showSign={showSign}
            onReplay={onReplay}
          />

          <Box className={classes.details}>
            <Box>
              <Title
                id="animal-player-title"
                order={2}
                className={classes.display}
              >
                {animal.name}
              </Title>
              <Box className={classes.soundRow}>
                <Text
                  id="animal-player-sound"
                  component="p"
                  className={classes.sound}
                >
                  <Marker>{animal.sound}</Marker>
                </Text>
                {audioState === "playing" ? <SoundBars /> : null}
              </Box>
            </Box>

            {audioState === "error" ? (
              <Text size="sm" c="dimmed" ta="center" className={classes.error}>
                No se pudo reproducir. Toca para escuchar.
              </Text>
            ) : null}

            <Button
              type="button"
              onClick={() => setSignAnimalId(showSign ? null : animal.id)}
              aria-pressed={showSign}
              aria-label={
                showSign
                  ? "Ver el animal"
                  : "Ver signo en Lengua de Signos Española"
              }
              variant="light"
              color="sky"
              size="sm"
              leftSection={<HandIcon size={20} />}
              className={classes.signToggle}
              styles={{
                label: {
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: "16px",
                },
              }}
            >
              {showSign ? "Ver el animal" : "Ver signo LSE"}
            </Button>

            <Box className={classes.nav}>
              <ActionIcon
                type="button"
                onClick={onPrevious}
                aria-label="Animal anterior"
                size={56}
                className={classes.arrow}
              >
                <ChevronLeftIcon size={24} />
              </ActionIcon>

              <Button
                type="button"
                onClick={onReplay}
                leftSection={<SpeakerIcon size={24} />}
                h={64}
                className={classes.replay}
              >
                {audioState === "error" ? "Toca para escuchar" : "Otra vez"}
              </Button>

              <ActionIcon
                type="button"
                onClick={onNext}
                aria-label="Animal siguiente"
                size={56}
                className={classes.arrow}
              >
                <ChevronRightIcon size={24} />
              </ActionIcon>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}