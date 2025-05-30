import type { Movie, TVShow } from "@/store/movieStore";

export function isTVShow(item: Movie | TVShow): item is TVShow {
    return "name" in item;
  }