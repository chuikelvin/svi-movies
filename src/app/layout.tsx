import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SVI Movies",
  description: "Your ultimate movie discovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}
