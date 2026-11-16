import { Badge, Box, Card, Image, Text } from "@mantine/core";
import type { Animal } from "@/lib/alaia-animals";
import { SpeakerIcon } from "../icons";
import classes from "./AnimalCard.module.css";

const tones = ["coral", "sun", "grass", "sky"] as const;

type AnimalCardProps = {
  animal: Animal;
  index: number;
  priority: boolean;
  onSelect: (trigger: HTMLButtonElement) => void;
};

function actionLabel(animal: Animal): string {
  const name = animal.name.toLocaleLowerCase("es");
  return `Escuchar ${animal.article === "la" ? "a la" : "al"} ${name}`;
}

export default function AnimalCard({
  animal,
  index,
  priority,
  onSelect,
}: AnimalCardProps) {
  const tone = tones[index % tones.length];

  return (
    <Card
      component="button"
      type="button"
      onClick={(event) => onSelect(event.currentTarget)}
      aria-label={actionLabel(animal)}
      padding={0}
      radius="lg"
      className={classes.card}
    >
      <Box className={classes.media}>
        <Image
          src={animal.poster}
          alt=""
          width={720}
          height={720}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fit="cover"
          className={classes.image}
        />
        <Box component="span" className={classes.speaker} aria-hidden="true">
          <SpeakerIcon size={19} />
        </Box>
      </Box>

      <Box className={classes.info}>
        <Text component="span" className={classes.name}>
          {animal.name}
        </Text>
        <Badge
          component="span"
          color={tone}
          variant="light"
          size="sm"
          tt="none"
          className={classes.sound}
        >
          {animal.sound}
        </Badge>
      </Box>
    </Card>
  );
}