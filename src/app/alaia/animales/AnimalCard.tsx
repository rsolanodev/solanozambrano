import type { Animal } from "@/lib/alaia-animals";
import { SpeakerIcon } from "../icons";

type AnimalCardProps = {
  animal: Animal;
  priority: boolean;
  onSelect: (trigger: HTMLButtonElement) => void;
};

function actionLabel(animal: Animal): string {
  const name = animal.name.toLocaleLowerCase("es");
  return `Escuchar ${animal.article === "la" ? "a la" : "al"} ${name}`;
}

export default function AnimalCard({
  animal,
  priority,
  onSelect,
}: AnimalCardProps) {
  return (
    <button
      type="button"
      onClick={(event) => onSelect(event.currentTarget)}
      aria-label={actionLabel(animal)}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface text-left shadow-[0_10px_30px_rgba(36,28,58,0.08)] outline-none transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(124,58,237,0.14)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-surface-variant">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={animal.poster}
          alt=""
          width={720}
          height={720}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <span
          className="absolute right-sm top-sm flex size-11 items-center justify-center rounded-full bg-surface/90 text-primary shadow-sm"
          aria-hidden="true"
        >
          <SpeakerIcon className="size-5" />
        </span>
      </span>
      <span className="flex flex-col gap-xs px-md py-sm">
        <span className="text-headline-sm text-text-primary">{animal.name}</span>
        <span
          className="inline-flex w-fit items-center rounded-full px-sm py-xs text-label-sm text-text-primary"
          style={{ backgroundColor: animal.accent }}
        >
          {animal.sound}
        </span>
      </span>
    </button>
  );
}
