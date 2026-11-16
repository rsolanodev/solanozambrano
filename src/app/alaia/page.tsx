"use client";

import Link from "next/link";
import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { BackButton } from "@/components/BackButton";
import { Marker } from "@/components/Marker";
import { PageDoodles } from "@/components/PageDoodles";
import {
  SparkleDoodle,
  SunDoodle,
} from "@/components/CrayonDoodles";
import { alaiaApps } from "@/lib/alaia-apps";
import { alaiaAnimalCount } from "@/lib/alaia-animals";
import AnimalesLogo from "./AnimalesLogo";
import { ChevronRightIcon } from "./icons";
import classes from "./launcher.module.css";

export default function AlaiaLauncherPage() {
  return (
    <Box component="main" className={classes.main}>
      <PageDoodles variant="app" />

      <Container size={1080} className={classes.shell}>
        <Box component="header" className={classes.topbar}>
          <BackButton href="/" label="Volver a perfiles">
            Perfiles
          </BackButton>
          <Badge color="coral" variant="light" size="md" className={classes.context}>
            Alaia
          </Badge>
        </Box>

        <Stack align="center" gap="md" className={classes.hero}>
          <Text className="text-label" c="var(--color-coral-strong)">
            El mundo de Alaia
          </Text>
          <Title order={1} className={classes.title}>
            Mundo de <Marker>Alaia</Marker>
          </Title>
          <Text component="p" className={classes.lead}>
            Animales, sonidos y signos para tocar, mirar y escuchar.
          </Text>
        </Stack>

        <Box className={classes.appArea}>
          {alaiaApps.map((app) => (
            <Card
              key={app.key}
              component={Link}
              href={app.href}
              aria-label={`Entrar en ${app.name}`}
              padding={0}
              radius="lg"
              className={classes.appCard}
            >
              <Box className={classes.logoStage}>
                <SunDoodle className={classes.stageSun} />
                <SparkleDoodle className={classes.stageSparkle} />
                <AnimalesLogo className={classes.logo} size={180} />
              </Box>

              <Box className={classes.appContent}>
                <Text className="text-label" c="var(--color-coral-strong)">
                  App de Alaia
                </Text>
                <Title order={2} className={classes.appName}>
                  {app.name}
                </Title>
                <Text component="p" className={classes.description}>
                  Toca un animal para verlo en movimiento y escuchar su sonido.
                  También puedes descubrir cómo se dice en lengua de signos.
                </Text>

                <Group gap="xs" className={classes.chips}>
                  <Badge color="coral" variant="light">
                    {alaiaAnimalCount} animales
                  </Badge>
                  <Badge color="sun" variant="light">
                    Sonidos reales
                  </Badge>
                  <Badge color="sky" variant="light">
                    Signos LSE
                  </Badge>
                </Group>

                <Box component="span" className={classes.cta}>
                  Entrar a {app.name}
                  <ChevronRightIcon size={18} />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        <Text component="p" className={classes.footer}>
          Un espacio pequeño, tranquilo y lleno de descubrimientos.
        </Text>
      </Container>
    </Box>
  );
}