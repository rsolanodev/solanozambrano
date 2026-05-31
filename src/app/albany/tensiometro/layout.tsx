export default function TensiometroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen pb-[72px]">{children}</div>;
}
