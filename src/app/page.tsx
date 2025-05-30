"use client";

import ContentSection from "@/components/ContentSection";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 w-full px-0">
      <Hero />
      <ContentSection
        title="Popular Movies"
        type="movie"
        limit={8}
        showViewAll={true}
      />

      <ContentSection
        title="Popular TV Shows"
        type="tv"
        limit={8}
        showViewAll={true}
      />

      <ContentSection
        title="Kids Content"
        type="kids"
        limit={8}
        showViewAll={true}
      />
    </main>
  );
}
