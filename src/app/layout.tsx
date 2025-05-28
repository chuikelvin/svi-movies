import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavigationBar";

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
      <body
        className={`${inter.className} min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]`}
      >
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
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <div className="fixed top-0 right-2 h-16 z-50 flex items-center justify-center md:hidden">
            <NavigationBar />
          </div>
          <main className="flex-1 w-full pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
