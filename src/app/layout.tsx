import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SVI Movies",
  description: "Discover and stream your favorite movies and TV shows",
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
        <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col items-center justify-start px-0 w-full">
          <Header />
          <main className="flex-grow pt-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
