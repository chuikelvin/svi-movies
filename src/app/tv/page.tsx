"use client";

import MovieList from "@/components/MovieList";

export default function SeriesPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <MovieList
          title="Popular Series"
          type="tv"
          gridCols={{ sm: 2, md: 3, lg: 4, xl: 6 }}
          showPagination={true}
        />
      </div>
    </main>
  );
}
