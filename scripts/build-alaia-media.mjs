import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const dataPath = path.join(root, "src/lib/alaia-animals.json");
const animals = JSON.parse(readFileSync(dataPath, "utf8"));
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const force = process.argv.includes("--force");
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const publicDir = path.join(root, "public/alaia/animales");
const videoDir = path.join(publicDir, "video");
const posterDir = path.join(publicDir, "poster");
const audioDir = path.join(publicDir, "audio");
const signDir = path.join(publicDir, "signos");
const tmpDir = path.join(root, "tmp/alaia-media");

await mkdir(videoDir, { recursive: true });
await mkdir(posterDir, { recursive: true });
await mkdir(audioDir, { recursive: true });
await mkdir(signDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}\n${stderr.slice(-2500)}`));
    });
  });
}

async function download(url, destination) {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "*/*" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Download failed with ${response.status} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1000) {
    throw new Error(`Downloaded file is too small (${buffer.length} bytes) for ${url}`);
  }
  await writeFile(destination, buffer);
}

function isFresh(file) {
  return !force && existsSync(file) && statSync(file).size > 0;
}

function assertSize(file, maxBytes, label) {
  const size = statSync(file).size;
  if (size > maxBytes) {
    console.warn(`  ! ${label} is ${(size / 1024).toFixed(0)}KB, above ${(maxBytes / 1024).toFixed(0)}KB`);
  }
  return size;
}

function audioFilter(animal) {
  const source = animal.sources.audio;
  const duration = source.duration;
  const fadeStart = Math.max(0, duration - 0.25);
  const normalize = "loudnorm=I=-16:TP=-1.5:LRA=11";

  if (source.repeat && source.repeat > 1) {
    const repeat = source.repeat;
    const gap = source.gap ?? 0.9;
    const split = `[0:a]asplit=${repeat}${Array.from({ length: repeat }, (_, index) => `[s${index}]`).join("")};`;
    const delays = Array.from(
      { length: repeat },
      (_, index) =>
        `[s${index}]adelay=${Math.round(index * gap * 1000)}|${Math.round(
          index * gap * 1000
        )}[a${index}]`
    ).join(";");
    const mixInputs = Array.from({ length: repeat }, (_, index) => `[a${index}]`).join("");
    return {
      complex: `${split}${delays};${mixInputs}amix=inputs=${repeat}:duration=longest:dropout_transition=0:normalize=0,${normalize},afade=t=in:st=0:d=0.03,afade=t=out:st=${fadeStart}:d=0.25[a]`,
      output: "[a]",
    };
  }

  const silence = source.trimSilence
    ? "silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB,"
    : "";
  return {
    simple: `${silence}${normalize},afade=t=in:st=0:d=0.03,afade=t=out:st=${fadeStart}:d=0.25`,
    output: null,
  };
}

const failures = [];
let processed = 0;

for (const animal of animals) {
  if (only && !only.has(animal.id)) continue;

  console.log(`\n▶ ${animal.id}`);
  const videoPath = path.join(root, "public", animal.video.replace(/^\//, ""));
  const posterPath = path.join(root, "public", animal.poster.replace(/^\//, ""));
  const audioPath = path.join(root, "public", animal.audio.replace(/^\//, ""));
  const signPath = path.join(root, "public", animal.sign.image.replace(/^\//, ""));
  const sourceVideo = path.join(tmpDir, `${animal.id}-source.mp4`);
  const sourceAudio = path.join(tmpDir, `${animal.id}-source.mp3`);
  const sourceSign = path.join(tmpDir, `${animal.id}-source-sign.png`);

  try {
    if (!isFresh(videoPath)) {
      console.log("  video · descargando de Pexels");
      await download(
        `https://www.pexels.com/download/video/${animal.sources.video.downloadId}/`,
        sourceVideo
      );
      console.log("  video · recortando y codificando");
      const crop =
        animal.sources.video.crop === "center"
          ? "crop='min(iw,ih)':'min(iw,ih)'"
          : animal.sources.video.crop;
      const filter = `${crop},scale=720:720,fps=30`;
      await run(ffmpeg, [
        "-y",
        "-ss",
        String(animal.sources.video.start),
        "-i",
        sourceVideo,
        "-t",
        String(animal.sources.video.duration),
        "-vf",
        filter,
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "28",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        videoPath,
      ]);
      await rm(sourceVideo, { force: true });
    } else {
      console.log("  video · existe");
    }

    if (!isFresh(posterPath)) {
      console.log("  poster · extrayendo frame");
      await run(ffmpeg, [
        "-y",
        "-ss",
        "0.6",
        "-i",
        videoPath,
        "-frames:v",
        "1",
        "-q:v",
        "3",
        posterPath,
      ]);
    } else {
      console.log("  poster · existe");
    }

    if (!isFresh(audioPath)) {
      console.log("  audio · descargando de Wikimedia");
      await download(animal.sources.audio.downloadUrl, sourceAudio);
      console.log("  audio · normalizando");
      const filter = audioFilter(animal);
      if (filter.complex) {
        await run(ffmpeg, [
          "-y",
          "-i",
          sourceAudio,
          "-filter_complex",
          filter.complex,
          "-map",
          filter.output,
          "-t",
          String(animal.sources.audio.duration),
          "-ac",
          "1",
          "-ar",
          "44100",
          "-b:a",
          "128k",
          audioPath,
        ]);
      } else {
        await run(ffmpeg, [
          "-y",
          "-i",
          sourceAudio,
          "-af",
          filter.simple,
          "-t",
          String(animal.sources.audio.duration),
          "-ac",
          "1",
          "-ar",
          "44100",
          "-b:a",
          "128k",
          audioPath,
        ]);
      }
      await rm(sourceAudio, { force: true });
    } else {
      console.log("  audio · existe");
    }

    if (!isFresh(signPath)) {
      console.log("  signo · descargando de Fundación CNSE");
      await download(animal.sign.source.downloadUrl, sourceSign);
      console.log("  signo · recortando y optimizando");
      await run(ffmpeg, [
        "-y",
        "-i",
        sourceSign,
        "-vf",
        "scale=960:480:force_original_aspect_ratio=decrease,pad=960:480:(ow-iw)/2:(oh-ih)/2:color=white,format=rgb24",
        "-frames:v",
        "1",
        "-q:v",
        "3",
        signPath,
      ]);
      await rm(sourceSign, { force: true });
    } else {
      console.log("  signo · existe");
    }

    const videoSize = assertSize(videoPath, 2_000_000, "video");
    const posterSize = assertSize(posterPath, 300_000, "poster");
    const audioSize = assertSize(audioPath, 500_000, "audio");
    const signSize = assertSize(signPath, 250_000, "signo");
    console.log(
      `  ✓ ${(videoSize / 1024).toFixed(0)}KB video · ${(posterSize / 1024).toFixed(
        0
      )}KB poster · ${(audioSize / 1024).toFixed(0)}KB audio · ${(
        signSize / 1024
      ).toFixed(0)}KB signo`
    );
    processed += 1;
  } catch (error) {
    failures.push({ id: animal.id, message: error.message });
    console.error(`  ✗ ${error.message}`);
  }
}

const credits = animals
  .map(
    (animal) =>
      `## ${animal.name}\n\n` +
      `- **Video**: [${animal.sources.video.provider}](${animal.sources.video.page}) — ${animal.sources.video.author} (${animal.sources.video.license}).\n` +
      `- **Audio**: [${animal.sources.audio.title}](${animal.sources.audio.page}) — ${animal.sources.audio.author} (${animal.sources.audio.license}).\n` +
      `- **Signo LSE**: [${animal.sign.source.provider}](${animal.sign.source.page}) — ${animal.sign.source.author} (${animal.sign.source.license}).\n`
  )
  .join("\n");

await writeFile(
  path.join(publicDir, "CREDITS.md"),
  `# Créditos de Animales\n\nLos videos son material de stock de Pexels. Los sonidos provienen de Wikimedia Commons. Los signos provienen de la Fundación CNSE. Todos conservan su licencia original y los archivos locales están recortados y normalizados para la app.\n\n${credits}`,
  "utf8"
);

console.log(`\nMedios procesados: ${processed}/${animals.length}`);
if (failures.length > 0) {
  console.error("\nFallos:");
  for (const failure of failures) console.error(`- ${failure.id}: ${failure.message}`);
  process.exitCode = 1;
}
