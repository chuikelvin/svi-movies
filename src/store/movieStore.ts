"use client";

import { create } from 'zustand';
import { tmdbApi, fetchPopularMovies, fetchPopularSeries as fetchPopularSeries, fetchKidsContent } from '@/lib/tmdb';

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    release_date: string;
    genres?: { id: number; name: string }[];
    runtime?: number;
    backdrop_path?: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
}

export interface MovieDetails extends Movie {
    cast: Cast[];
    crew: Crew[];
    similar: Movie[];
}

interface ContentState {
    items: Movie[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

export interface MovieState {
    movies: ContentState;
    series: ContentState;
    kidsContent: ContentState;
    searchResults: Movie[];
    selectedMovie: MovieDetails | null;
    searchLoading: boolean;
    searchError: string | null;
    currentPage: number;
    totalPages: number;
    fetchMovies: (page: number, type?: "movie" | "tv" | "kids") => Promise<void>;
    searchMovies: (query: string, page?: number) => Promise<void>;
    liveSearch: (query: string) => Promise<void>;
    fetchMovieDetails: (id: number) => Promise<void>;
    clearSelectedMovie: () => void;
    clearSearchResults: () => void;
}

const initialContentState: ContentState = {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const useMovieStore = create<MovieState>((set) => ({
    movies: { ...initialContentState },
    series: { ...initialContentState },
    kidsContent: { ...initialContentState },
    searchResults: [],
    selectedMovie: null,
    searchLoading: false,
    searchError: null,
    currentPage: 1,
    totalPages: 1,

    fetchMovies: async (page: number, type: "movie" | "tv" | "kids" = "movie") => {
        const stateKey = type === "movie" ? "movies" : type === "tv" ? "series" : "kidsContent";

        set((state) => ({
            [stateKey]: { ...state[stateKey], loading: true, error: null }
        }));

        try {
            let response;
            switch (type) {
                case "tv":
                    response = await fetchPopularSeries(page);
                    break;
                case "kids":
                    response = await fetchKidsContent(page);
                    break;
                default:
                    response = await fetchPopularMovies(page);
            }

            set((state) => ({
                [stateKey]: {
                    items: response.results,
                    currentPage: page,
                    totalPages: response.total_pages,
                    loading: false,
                    error: null
                }
            }));
        } catch (error) {
            set((state) => ({
                [stateKey]: {
                    ...state[stateKey],
                    error: "Failed to fetch content. Please try again later.",
                    loading: false
                }
            }));
        }
    },

    searchMovies: async (query: string, page = 1) => {
        try {
            set({ searchLoading: true, searchError: null });
            const response = await tmdbApi.get('/search/movie', {
                params: { query, page },
            });
            set({
                searchResults: response.data.results,
                searchLoading: false,
                searchError: null
            });
        } catch (_error) {
            set({
                searchError: 'Failed to search movies',
                searchLoading: false
            });
        }
    },

    liveSearch: async (query: string) => {
        try {
            set({ searchLoading: true, searchError: null });
            const response = await tmdbApi.get('/search/movie', {
                params: { query, page: 1 },
            });
            set({
                searchResults: response.data.results.slice(0, 5),
                searchLoading: false,
                searchError: null
            });
        } catch (_error) {
            set({
                searchError: 'Failed to search movies',
                searchLoading: false
            });
        }
    },

    fetchMovieDetails: async (id: number) => {
        try {
            set((state) => ({
                movies: { ...state.movies, loading: true }
            }));
            const [movieResponse, creditsResponse, similarResponse] = await Promise.all([
                tmdbApi.get(`/movie/${id}`),
                tmdbApi.get(`/movie/${id}/credits`),
                tmdbApi.get(`/movie/${id}/similar`),
            ]);

            const movieDetails: MovieDetails = {
                ...movieResponse.data,
                cast: creditsResponse.data.cast,
                crew: creditsResponse.data.crew,
                similar: similarResponse.data.results,
            };

            set({
                selectedMovie: movieDetails,
                movies: { ...useMovieStore.getState().movies, loading: false }
            });
        } catch (_error) {
            set((state) => ({
                movies: { ...state.movies, error: 'Failed to fetch movie details', loading: false }
            }));
        }
    },

    clearSelectedMovie: () => set({ selectedMovie: null }),
    clearSearchResults: () => set({ searchResults: [] }),
})); 