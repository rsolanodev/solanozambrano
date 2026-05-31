import Link from "next/link";
import { profiles, type Profile } from "@/lib/profiles";

function ProfileAvatar({ profile }: { profile: Profile }) {
  return (
    <span className="relative flex size-28 items-center justify-center rounded-full bg-surface shadow-[0_18px_42px_rgba(255,122,144,0.2)] transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 sm:size-32">
      <span
        className="absolute inset-2 rounded-full"
        style={{ backgroundColor: profile.accentSoft }}
        aria-hidden="true"
      />
      <span
        className="relative flex size-20 items-center justify-center rounded-full text-headline-lg text-surface shadow-[0_12px_28px_rgba(40,35,42,0.16)] sm:size-24"
        style={{ backgroundColor: profile.accent }}
        aria-hidden="true"
      >
        {profile.icon}
      </span>
    </span>
  );
}

function ProfileTile({ profile }: { profile: Profile }) {
  const content = (
    <>
      <ProfileAvatar profile={profile} />
      <span className="text-headline-sm text-text-primary">{profile.name}</span>
      {!profile.href && (
        <span
          className="rounded-full px-sm py-xs text-label-sm"
          style={{
            backgroundColor: profile.accentSoft,
            color: profile.accent,
          }}
        >
          Próximamente
        </span>
      )}
    </>
  );

  const className =
    "group flex min-w-0 flex-col items-center gap-md rounded-md bg-surface/85 px-md py-lg text-center shadow-[0_18px_45px_rgba(255,122,144,0.12)] outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (profile.href) {
    return (
      <Link
        href={profile.href}
        className={`${className} hover:-translate-y-1 hover:bg-surface`}
        aria-label={`Entrar como ${profile.name}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`${className} cursor-not-allowed opacity-70`}
      aria-label={`${profile.name} pendiente`}
    >
      {content}
    </button>
  );
}

export default function ProfileSelectionPage() {
  return (
    <main
      data-profile-theme="family"
      className="min-h-screen bg-background px-lg py-xl text-text-primary"
    >
      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-5xl flex-col items-center justify-center gap-xl">
        <div className="w-full text-center">
          <p className="text-label-sm uppercase text-primary">
            Familia Solano Zambrano
          </p>
          <h1 className="mt-sm text-headline-lg">¿Quién va a entrar?</h1>
        </div>

        <div className="grid w-full grid-cols-2 gap-md sm:grid-cols-5 sm:gap-lg">
          {profiles.map((profile) => (
            <ProfileTile key={profile.slug} profile={profile} />
          ))}
        </div>
      </section>
    </main>
  );
}
