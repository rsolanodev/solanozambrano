import { getSpainToday } from "./helpers";

const SPAIN_TZ = "Europe/Madrid";

function dateStrToUtcMs(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function pregnancyStartToDateStr(startDateStr: string) {
  const [day, month, year] = startDateStr.split("/").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function dateToSpainDateStr(date: Date) {
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: SPAIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

export function getPregnancyWeek(
  startDateStr?: string,
  today?: Date
) {
  const defaultStart =
    process.env.NEXT_PUBLIC_PREGNANCY_START_DATE || "23/02/2026";
  const startStr = startDateStr || defaultStart;

  const start = pregnancyStartToDateStr(startStr);
  const referenceDate = today
    ? dateToSpainDateStr(new Date(today))
    : getSpainToday();
  const diffMs = dateStrToUtcMs(referenceDate) - dateStrToUtcMs(start);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(totalDays / 7);
  const dayOfWeek = totalDays % 7;

  return { week, totalDays, dayOfWeek };
}
