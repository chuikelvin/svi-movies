"use client";

import MovieList from "@/components/MovieList";

export default function KidsContentPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <MovieList
          title="Family-Friendly Content"
          type="kids"
          gridCols={{ sm: 2, md: 3, lg: 4, xl: 6 }}
          showPagination={true}
        />
      </div>
    </main>
  );
}
