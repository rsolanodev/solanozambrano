import type { CSSProperties } from "react";

export type DoodleProps = {
  className?: string;
  style?: CSSProperties;
};

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SquiggleDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 32"
      width={120}
      height={32}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 20c10-14 20-14 30 0s20 14 30 0 20-14 30 0 16 12 22 4"
        {...strokeProps}
      />
    </svg>
  );
}

export function SparkleDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={48}
      height={48}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24 3c2 12 8 18 21 21-13 3-19 9-21 21-2-12-8-18-21-21C16 21 22 15 24 3Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function SunDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="12" fill="currentColor" stroke="none" />
      <g {...strokeProps}>
        <path d="M32 7v7M32 50v7M7 32h7M50 32h7" />
        <path d="M14 14l5 5M45 45l5 5M50 14l-5 5M19 45l-5 5" />
      </g>
    </svg>
  );
}

export function LoopDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 80 56"
      width={80}
      height={56}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 34c2-20 24-29 38-20s12 30-3 34S9 38 16 24s32-14 44-2 10 20 14 20"
        {...strokeProps}
      />
    </svg>
  );
}

export function ZigzagDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 64 32"
      width={64}
      height={32}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 24 16 8l12 16L40 8l12 16 8-8" {...strokeProps} />
    </svg>
  );
}

export function UnderlineDoodle({ className, style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 200 24"
      width={200}
      height={24}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M3 17C45 5 105 4 197 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={10}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}