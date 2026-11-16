"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Badge,
  Box,
  Card,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { BrandMark } from "@/components/BrandMark";
import { Marker } from "@/components/Marker";
import { PageDoodles } from "@/components/PageDoodles";
import { SparkleDoodle } from "@/components/CrayonDoodles";
import { profiles, type Profile } from "@/lib/profiles";
import { ChevronRightIcon } from "@/app/alaia/icons";
import classes from "./profile-selection.module.css";

const tiltClasses = [
  classes.tiltA,
  classes.tiltB,
  classes.tiltC,
  classes.tiltD,
];

function ProfileTile({
  profile,
  index,
}: {
  profile: Profile;
  index: number;
}) {
  const className = `${classes.tile} ${tiltClasses[index % tiltClasses.length]} ${
    profile.href ? classes.tileActive : classes.tilePending
  }`;
  const style = {
    "--profile-tone": profile.accent,
    "--profile-soft": profile.accentSoft,
  } as CSSProperties;

  const content = (
    <>
      <Box className={classes.avatar}>
        <Box className={classes.avatarBlob}>
          <span className={classes.avatarLetter}>{profile.icon}</span>
        </Box>
        <SparkleDoodle className={classes.avatarSparkle} />
      </Box>

      <Stack gap={2} align="center" className={classes.profileText}>
        <Text component="span" className={classes.name}>
          {profile.name}
        </Text>
        <Text component="span" className={classes.role}>
          {profile.href ? "Tu espacio" : "En preparación"}
        </Text>
      </Stack>

      {profile.href ? (
        <Box component="span" className={classes.enterPill}>
          Entrar
          <ChevronRightIcon size={15} />
        </Box>
      ) : (
        <Badge color="sun" variant="light" size="sm" className={classes.soonPill}>
          Muy pronto
        </Badge>
      )}
    </>
  );

  if (profile.href) {
    return (
      <Card
        component={Link}
        href={profile.href}
        aria-label={`Entrar como ${profile.name}`}
        padding={0}
        radius="lg"
        className={className}
        style={style}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card
      component="button"
      type="button"
      disabled
      aria-label={`${profile.name} pendiente`}
      padding={0}
      radius="lg"
      className={className}
      style={style}
    >
      {content}
    </Card>
  );
}

export default function ProfileSelectionPage() {
  return (
    <Box component="main" className={classes.main}>
      <PageDoodles variant="home" />

      <Container size={1180} className={classes.shell}>
        <Box component="header" className={classes.topbar}>
          <BrandMark />
          <Badge
            color="sun"
            variant="light"
            size="md"
            className={classes.familyBadge}
          >
            Familia Solano Zambrano
          </Badge>
        </Box>

        <Stack align="center" gap="md" className={classes.hero}>
          <Text className="text-label" c="var(--color-coral-strong)">
            Hola, familia
          </Text>
          <Title order={1} className={classes.title}>
            ¿Quién va a <Marker>entrar</Marker>?
          </Title>
          <Text component="p" className={classes.lead}>
            Elige tu rincón. Cada perfil tiene su espacio, su color y sus cosas
            favoritas.
          </Text>
        </Stack>

        <SimpleGrid
          cols={{ base: 2, sm: 3, lg: 5 }}
          spacing={{ base: "md", sm: "lg" }}
          className={classes.grid}
        >
          {profiles.map((profile, index) => (
            <ProfileTile key={profile.slug} profile={profile} index={index} />
          ))}
        </SimpleGrid>

        <Text component="p" className={classes.footer}>
          Un lugar para cuidarnos, aprender y jugar.
        </Text>
      </Container>
    </Box>
  );
}