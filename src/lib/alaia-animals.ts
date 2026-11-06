import animalData from "./alaia-animals.json";

export type AnimalCategory = "granja" | "mascotas" | "salvaje";

type BaseSource = {
  provider: string;
  page: string;
  author: string;
  license: string;
};

export type AnimalVideoSource = BaseSource & {
  downloadId: string;
  start: number;
  duration: number;
  crop: string;
};

export type AnimalAudioSource = BaseSource & {
  title: string;
  downloadUrl: string;
  start: number;
  duration: number;
  trimSilence?: boolean;
  repeat?: number;
  gap?: number;
};

export type Animal = {
  id: string;
  name: string;
  sound: string;
  article: "la" | "el";
  category: AnimalCategory;
  accent: string;
  video: string;
  poster: string;
  audio: string;
  sources: {
    video: AnimalVideoSource;
    audio: AnimalAudioSource;
  };
};

export const alaiaAnimals = animalData as Animal[];
export const alaiaAnimalCount = alaiaAnimals.length;

export function getAlaiaAnimal(id: string): Animal | undefined {
  return alaiaAnimals.find((animal) => animal.id === id);
}
