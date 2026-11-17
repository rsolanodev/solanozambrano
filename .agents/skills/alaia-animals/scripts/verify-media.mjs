#!/usr/bin/env node
/**
 * Informe técnico de los medios de la app de animales de Alaia.
 *
 * Uso, desde la raíz del repositorio:
 *   node .agents/skills/alaia-animals/scripts/verify-media.mjs
 *   node .agents/skills/alaia-animals/scripts/verify-media.mjs caballo,gato
 *   node .agents/skills/alaia-animals/scripts/verify-media.mjs caballo --frames
 *
 * Requiere ffprobe (y ffmpeg para --frames). Si no están en PATH, busca un
 * build estático en /tmp/ffmpeg-*-amd64-static; también acepta FFPROBE/FFMPEG.
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const LIMITS = {
  video: 2_000_000,
  poster: 300_000,
  audio: 500_000,
  sign: 250_000,
};

function findRoot() {
  const candidates = [
    process.cwd(),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.."),
  ];
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, "src/lib/alaia-animals.json"))) {
      return candidate;
    }
  }
  console.error(
    "No encuentro src/lib/alaia-animals.json. Ejecuta el script desde la raíz del repositorio."
  );
  process.exit(2);
}

function findTool(envName, binary) {
  const candidates = [];
  if (process.env[envName]) candidates.push(process.env[envName]);
  candidates.push(binary);

  try {
    const tmpEntries = readdirSync("/tmp").filter(
      (name) => name.startsWith("ffmpeg-") && name.endsWith("-amd64-static")
    );
    for (const entry of tmpEntries) {
      candidates.push(path.join("/tmp", entry, binary));
    }
  } catch {
    // /tmp no está disponible; seguimos con PATH y la variable de entorno.
  }

  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["-version"], { encoding: "utf8" });
    if (!result.error && result.status === 0) return candidate;
  }
  return null;
}

function run(command, args) {
  return spawnSync(command, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
}

function probe(ffprobe, file) {
  const result = run(ffprobe, [
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `ffprobe falló con ${file}`);
  }
  return JSON.parse(result.stdout);
}

function volume(ffmpeg, file) {
  const sample = run(ffmpeg, [
    "-hide_banner",
    "-i",
    file,
    "-af",
    "volumedetect",
    "-f",
    "null",
    "-",
  ]);
  const sampleText = `${sample.stdout}\n${sample.stderr}`;
  const max = sampleText.match(/max_volume:\s*(-?[\d.]+) dB/);
  const mean = sampleText.match(/mean_volume:\s*(-?[\d.]+) dB/);

  const loudness = run(ffmpeg, [
    "-hide_banner",
    "-nostats",
    "-i",
    file,
    "-af",
    "ebur128=peak=true",
    "-f",
    "null",
    "-",
  ]);
  const loudnessText = `${loudness.stdout}\n${loudness.stderr}`;
  const truePeak = loudnessText.match(/Peak:\s*(-?[\d.]+) dBFS/);
  const integratedMatches = [...loudnessText.matchAll(/I:\s*(-?[\d.]+) LUFS/g)];
  const integrated = integratedMatches.at(-1);

  return {
    max: max ? Number(max[1]) : null,
    mean: mean ? Number(mean[1]) : null,
    truePeak: truePeak ? Number(truePeak[1]) : null,
    integrated: integrated ? Number(integrated[1]) : null,
  };
}

function mb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function dimensions(stream) {
  if (!stream?.width || !stream?.height) return "?";
  return `${stream.width}x${stream.height}`;
}

function seconds(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(2)}s` : "?";
}

function reportFile(file, limit, kind) {
  if (!existsSync(file)) {
    return { ok: false, message: `falta ${kind}` };
  }
  const size = statSync(file).size;
  if (size <= 0) return { ok: false, message: `${kind} vacío` };
  if (size > limit) {
    return {
      ok: false,
      message: `${kind} ${mb(size)} supera ${mb(limit)}`,
    };
  }
  return { ok: true, size };
}

const root = findRoot();
const dataPath = path.join(root, "src/lib/alaia-animals.json");
const animals = JSON.parse(readFileSync(dataPath, "utf8"));
const args = process.argv.slice(2);
const frames = args.includes("--frames");
const rawIds = args
  .filter((arg) => !arg.startsWith("--"))
  .flatMap((arg) => arg.split(","))
  .filter(Boolean);

const selected = rawIds.length
  ? animals.filter((animal) => rawIds.includes(animal.id))
  : animals;

if (selected.length === 0) {
  console.error(`No hay animales para: ${rawIds.join(", ")}`);
  process.exit(2);
}

const missingIds = rawIds.filter(
  (id) => !animals.some((animal) => animal.id === id)
);
if (missingIds.length) {
  console.error(`IDs desconocidos: ${missingIds.join(", ")}`);
  process.exit(2);
}

const ffprobe = findTool("FFPROBE", "ffprobe");
const ffmpeg = findTool("FFMPEG", "ffmpeg");
if (!ffprobe) {
  console.error(
    "No encuentro ffprobe. Instala ffmpeg o exporta FFPROBE=/ruta/a/ffprobe.\n" +
      "Puedes descargar un binario estático desde https://johnvansickle.com/ffmpeg/"
  );
  process.exit(2);
}
if (frames && !ffmpeg) {
  console.error("No encuentro ffmpeg; no puedo generar hojas de contacto.");
  process.exit(2);
}

let errors = 0;
let warnings = 0;

for (const animal of selected) {
  console.log(`\n▶ ${animal.id}`);
  const files = {
    video: path.join(root, "public", animal.video.replace(/^\//, "")),
    poster: path.join(root, "public", animal.poster.replace(/^\//, "")),
    audio: path.join(root, "public", animal.audio.replace(/^\//, "")),
    sign: path.join(root, "public", animal.sign.image.replace(/^\//, "")),
  };

  const statuses = {};
  for (const [kind, file] of Object.entries(files)) {
    statuses[kind] = reportFile(file, LIMITS[kind], kind);
    if (!statuses[kind].ok) {
      errors += 1;
      console.log(`  ✗ ${kind}: ${statuses[kind].message}`);
    }
  }

  if (statuses.video.ok) {
    try {
      const info = probe(ffprobe, files.video);
      const stream = info.streams.find((item) => item.codec_type === "video");
      const duration = info.format?.duration ?? stream?.duration;
      const details = [
        dimensions(stream),
        stream?.codec_name ?? "?",
        seconds(duration),
        mb(statuses.video.size),
      ];
      const problems = [];
      if (stream?.width !== 720 || stream?.height !== 720) {
        problems.push("debería ser 720x720");
      }
      if (stream?.codec_name !== "h264") problems.push("debería ser h264");
      if (Number(duration) < 4 || Number(duration) > 6.5) {
        problems.push("duración fuera de 4–6.5 s");
      }
      if (problems.length) {
        warnings += 1;
        console.log(`  ! video: ${details.join(" · ")} — ${problems.join("; ")}`);
      } else {
        console.log(`  ✓ video: ${details.join(" · ")}`);
      }
    } catch (error) {
      errors += 1;
      console.log(`  ✗ video: ${error.message}`);
    }
  }

  if (statuses.poster.ok) {
    try {
      const info = probe(ffprobe, files.poster);
      const stream = info.streams.find((item) => item.codec_type === "video");
      if (stream?.width !== 720 || stream?.height !== 720) {
        warnings += 1;
        console.log(
          `  ! poster: ${dimensions(stream)} · ${mb(statuses.poster.size)} — debería ser 720x720`
        );
      } else {
        console.log(`  ✓ poster: ${dimensions(stream)} · ${mb(statuses.poster.size)}`);
      }
    } catch (error) {
      errors += 1;
      console.log(`  ✗ poster: ${error.message}`);
    }
  }

  if (statuses.audio.ok) {
    try {
      const info = probe(ffprobe, files.audio);
      const stream = info.streams.find((item) => item.codec_type === "audio");
      const duration = info.format?.duration ?? stream?.duration;
      const levels = ffmpeg
        ? volume(ffmpeg, files.audio)
        : { max: null, mean: null, truePeak: null, integrated: null };
      const details = [
        seconds(duration),
        mb(statuses.audio.size),
        levels.max === null ? null : `pico ${levels.max.toFixed(1)} dB`,
        levels.truePeak === null ? null : `TP ${levels.truePeak.toFixed(1)} dBTP`,
        levels.integrated === null ? null : `I ${levels.integrated.toFixed(1)} LUFS`,
      ].filter(Boolean);
      const problems = [];
      if (Number(duration) < 1 || Number(duration) > 8) {
        problems.push("duración fuera de 1–8 s");
      }
      if (levels.truePeak !== null && levels.truePeak > 0) {
        problems.push("true peak por encima de 0 dBFS");
      }
      if (problems.length) {
        warnings += 1;
        console.log(`  ! audio: ${details.join(" · ")} — ${problems.join("; ")}`);
      } else {
        console.log(`  ✓ audio: ${details.join(" · ")}`);
      }
    } catch (error) {
      errors += 1;
      console.log(`  ✗ audio: ${error.message}`);
    }
  }

  if (statuses.sign.ok) {
    try {
      const info = probe(ffprobe, files.sign);
      const stream = info.streams.find((item) => item.codec_type === "video");
      if (stream?.width !== 960 || stream?.height !== 480) {
        warnings += 1;
        console.log(
          `  ! signo: ${dimensions(stream)} · ${mb(statuses.sign.size)} — debería ser 960x480`
        );
      } else {
        console.log(`  ✓ signo: ${dimensions(stream)} · ${mb(statuses.sign.size)}`);
      }
    } catch (error) {
      errors += 1;
      console.log(`  ✗ signo: ${error.message}`);
    }
  }

  if (frames && statuses.video.ok && ffmpeg) {
    try {
      const outputDir = "/tmp/alaia-check";
      mkdirSync(outputDir, { recursive: true });
      const output = path.join(outputDir, `${animal.id}-strip.jpg`);
      const result = run(ffmpeg, [
        "-y",
        "-loglevel",
        "error",
        "-i",
        files.video,
        "-vf",
        "fps=2,scale=240:-1,tile=5x2",
        "-frames:v",
        "1",
        output,
      ]);
      if (result.status === 0) {
        console.log(`  → hoja de contacto: ${output}`);
      } else {
        warnings += 1;
        console.log(`  ! no pude generar la hoja de contacto: ${result.stderr.trim()}`);
      }
    } catch (error) {
      warnings += 1;
      console.log(`  ! no pude generar la hoja de contacto: ${error.message}`);
    }
  }
}

console.log(
  `\nResultado: ${selected.length} animal(es), ${errors} error(es), ${warnings} aviso(s).`
);
if (errors > 0) process.exitCode = 1;