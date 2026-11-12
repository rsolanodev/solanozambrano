import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { alaiaAnimals, getAlaiaAnimal } from "./alaia-animals";

const assetPath = (url: string) =>
  path.join(process.cwd(), "public", url.replace(/^\//, ""));

describe("alaiaAnimals", () => {
  it("has 22 unique animals with complete display data", () => {
    expect(alaiaAnimals).toHaveLength(22);
    expect(new Set(alaiaAnimals.map((animal) => animal.id)).size).toBe(22);

    for (const animal of alaiaAnimals) {
      expect(animal.id).toMatch(/^[a-z]+$/);
      expect(animal.name.length).toBeGreaterThan(0);
      expect(animal.sound.length).toBeGreaterThan(0);
      expect(["la", "el"]).toContain(animal.article);
      expect(["granja", "mascotas", "salvaje"]).toContain(animal.category);
      expect(animal.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("has complete source credits for video, audio and signs", () => {
    for (const animal of alaiaAnimals) {
      const { video, audio } = animal.sources;

      expect(video.provider).toBe("Pexels");
      expect(video.page).toMatch(/^https:\/\//);
      expect(video.author.length).toBeGreaterThan(0);
      expect(video.license.length).toBeGreaterThan(0);
      expect(video.downloadId).toMatch(/^\d+$/);
      expect(video.duration).toBeGreaterThan(0);
      expect(video.crop.length).toBeGreaterThan(0);

      expect(audio.provider).toBe("Wikimedia Commons");
      expect(audio.page).toMatch(/^https:\/\//);
      expect(audio.title).toMatch(/^File:/);
      expect(audio.author.length).toBeGreaterThan(0);
      expect(audio.license.length).toBeGreaterThan(0);
      expect(audio.downloadUrl).toMatch(/^https:\/\//);
      expect(audio.duration).toBeGreaterThan(0);

      expect(animal.sign.image).toBe(`/alaia/animales/signos/${animal.id}.jpg`);
      expect(animal.sign.alt).toContain("Lengua de Signos Española");
      expect(animal.sign.source.provider.length).toBeGreaterThan(0);
      expect(animal.sign.source.page).toMatch(/^https:\/\//);
      expect(animal.sign.source.author.length).toBeGreaterThan(0);
      expect(animal.sign.source.license.length).toBeGreaterThan(0);
      expect(animal.sign.source.downloadUrl).toMatch(/^https:\/\//);
    }
  });

  it("serves all media from local optimized assets", () => {
    for (const animal of alaiaAnimals) {
      expect(animal.video.startsWith("/alaia/animales/video/")).toBe(true);
      expect(animal.poster.startsWith("/alaia/animales/poster/")).toBe(true);
      expect(animal.audio.startsWith("/alaia/animales/audio/")).toBe(true);
      expect(animal.sign.image.startsWith("/alaia/animales/signos/")).toBe(true);

      const checks = [
        [animal.video, ".mp4", 2_000_000],
        [animal.poster, ".jpg", 300_000],
        [animal.audio, ".mp3", 500_000],
        [animal.sign.image, ".jpg", 250_000],
      ] as const;

      for (const [url, extension, maxBytes] of checks) {
        expect(url.endsWith(extension)).toBe(true);
        const file = assetPath(url);
        expect(existsSync(file), `${animal.id}: falta ${url}`).toBe(true);
        const size = statSync(file).size;
        expect(size).toBeGreaterThan(0);
        expect(size).toBeLessThan(maxBytes);
      }
    }
  });

  it("finds animals by id", () => {
    expect(getAlaiaAnimal("vaca")?.name).toBe("Vaca");
    expect(getAlaiaAnimal("abeja")?.name).toBe("Abeja");
    expect(getAlaiaAnimal("no-existe")).toBeUndefined();
  });
});
