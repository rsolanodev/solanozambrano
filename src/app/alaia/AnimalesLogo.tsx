export default function AnimalesLogo({
  className = "size-36",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect width="128" height="128" rx="36" fill="var(--color-primary-soft)" />
      <ellipse cx="54" cy="62" rx="30" ry="28" fill="var(--color-primary)" />
      <ellipse
        cx="31"
        cy="56"
        rx="13"
        ry="19"
        fill="var(--color-primary)"
        opacity="0.82"
      />
      <ellipse
        cx="77"
        cy="56"
        rx="13"
        ry="19"
        fill="var(--color-primary)"
        opacity="0.82"
      />
      <path
        d="M54 84c0 12 3 19 10 21 6 1 11-2 11-7 0-3-2-5-5-5-2 0-3 1-4 2"
        stroke="var(--color-primary)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="45" cy="58" r="3.5" fill="var(--color-surface)" />
      <circle cx="63" cy="58" r="3.5" fill="var(--color-surface)" />
      <path
        d="M48 72c3 2 9 2 12 0"
        stroke="var(--color-primary-soft)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M92 48c5 5 5 15 0 20"
        stroke="var(--color-primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M101 40c8 8 8 22 0 30"
        stroke="var(--color-primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
