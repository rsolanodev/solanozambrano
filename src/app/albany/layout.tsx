export default function AlbanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-profile-theme="albany"
      className="min-h-screen bg-background text-text-primary"
    >
      {children}
    </div>
  );
}
