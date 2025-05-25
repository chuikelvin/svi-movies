import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "react-hot-toast";

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
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--color-modal-background)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-background-secondary)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
