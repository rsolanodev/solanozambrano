import Link from "next/link";

export default function AppsLauncherLink() {
  return (
    <Link
      href="/albany"
      aria-label="Volver a apps"
      className="mr-sm size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
    </Link>
  );
}
