"use client";

import type { CSSProperties } from "react";
import {
  Anchor,
  Badge,
  Box,
  Card,
  Container,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { alaiaAnimals } from "@/lib/alaia-animals";
import { BackButton } from "@/components/BackButton";
import { Marker } from "@/components/Marker";
import { PageDoodles } from "@/components/PageDoodles";
import classes from "./credits.module.css";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;

const tones = [
  "var(--color-coral)",
  "var(--color-sun)",
  "var(--color-grass)",
  "var(--color-sky)",
];

export default function AnimalCreditsPage() {
  return (
    <Box component="main" className={classes.main}>
      <PageDoodles variant="credits" />

      <Container size={1080} className={classes.shell}>
        <Box component="header" className={classes.topbar}>
          <BackButton href="/alaia/animales" label="Volver a Animales">
            Animales
          </BackButton>
          <Badge color="sky" variant="light" size="md" className={classes.context}>
            Fuentes y licencias
          </Badge>
        </Box>

        <Box className={classes.hero}>
          <Text className="text-label" c="var(--color-coral-strong)">
            Mundo de Alaia
          </Text>
          <Title order={1} className={classes.title}>
            <Marker>Créditos</Marker>
          </Title>
          <Text component="p" className={classes.lead}>
            Los videos son material de stock de Pexels. Los sonidos provienen de
            Wikimedia Commons. Los signos provienen de la Fundación CNSE y
            conservan su licencia original.
          </Text>
        </Box>

        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing="lg"
          className={classes.grid}
        >
          {alaiaAnimals.map((animal, index) => (
            <Card
              key={animal.id}
              padding="md"
              radius="lg"
              className={classes.card}
              style={
                {
                  "--card-tone": tones[index % tones.length],
                } as CSSProperties
              }
            >
              <Title order={2} size="h4" className={classes.animalName}>
                {animal.name}
              </Title>

              <Box component="dl" className={classes.definitions}>
                <Box className={classes.definitionGroup}>
                  <Badge
                    component="dt"
                    color="coral"
                    variant="light"
                    size="sm"
                    className={classes.term}
                  >
                    Video
                  </Badge>
                  <Text
                    component="dd"
                    size="sm"
                    c="dimmed"
                    className={classes.definition}
                  >
                    <Anchor
                      href={animal.sources.video.page}
                      {...externalLinkProps}
                      aria-label={`Video de ${animal.name} en ${animal.sources.video.provider} (abre en una pestaña nueva)`}
                      underline="always"
                    >
                      {animal.sources.video.provider} ↗
                    </Anchor>
                    <span>
                      {" "}
                      · {animal.sources.video.author} ·{" "}
                      {animal.sources.video.license}
                    </span>
                  </Text>
                </Box>

                <Box className={classes.definitionGroup}>
                  <Badge
                    component="dt"
                    color="grass"
                    variant="light"
                    size="sm"
                    className={classes.term}
                  >
                    Audio
                  </Badge>
                  <Text
                    component="dd"
                    size="sm"
                    c="dimmed"
                    className={classes.definition}
                  >
                    <Anchor
                      href={animal.sources.audio.page}
                      {...externalLinkProps}
                      aria-label={`Audio de ${animal.name} en Wikimedia Commons (abre en una pestaña nueva)`}
                      underline="always"
                    >
                      {animal.sources.audio.title.replace(/^File:/, "")} ↗
                    </Anchor>
                    <span>
                      {" "}
                      · {animal.sources.audio.author} ·{" "}
                      {animal.sources.audio.license}
                    </span>
                  </Text>
                </Box>

                <Box className={classes.definitionGroup}>
                  <Badge
                    component="dt"
                    color="sky"
                    variant="light"
                    size="sm"
                    className={classes.term}
                  >
                    Signo LSE
                  </Badge>
                  <Text
                    component="dd"
                    size="sm"
                    c="dimmed"
                    className={classes.definition}
                  >
                    <Anchor
                      href={animal.sign.source.page}
                      {...externalLinkProps}
                      aria-label={`Signo de ${animal.name} en ${animal.sign.source.provider} (abre en una pestaña nueva)`}
                      underline="always"
                    >
                      {animal.sign.source.provider} ↗
                    </Anchor>
                    <span>
                      {" "}
                      · {animal.sign.source.author} ·{" "}
                      {animal.sign.source.license}
                    </span>
                  </Text>
                </Box>
              </Box>
            </Card>
          ))}
        </SimpleGrid>

        <Text component="p" className={classes.footer}>
          Gracias a las personas y proyectos que comparten estos materiales.
        </Text>
      </Container>
    </Box>
  );
}