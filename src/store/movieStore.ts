import { create } from 'zustand';
import { tmdbApi } from '@/lib/tmdb';

interface Movie {
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

interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
}

interface MovieDetails extends Movie {
    cast: Cast[];
    crew: Crew[];
    similar: Movie[];
}

interface MovieState {
    movies: Movie[];
    selectedMovie: MovieDetails | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    fetchMovies: (page?: number) => Promise<void>;
    searchMovies: (query: string, page?: number) => Promise<void>;
    fetchMovieDetails: (id: number) => Promise<void>;
    clearSelectedMovie: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    fetchMovies: async (page = 1) => {
        try {
            set({ loading: true, error: null });
            const response = await tmdbApi.get('/movie/popular', {
                params: { page },
            });
            set({
                movies: response.data.results,
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                loading: false,
            });
        } catch (_error) {
            set({ error: 'Failed to fetch movies', loading: false });
        }
    },
    searchMovies: async (query: string, page = 1) => {
        try {
            set({ loading: true, error: null });
            const response = await tmdbApi.get('/search/movie', {
                params: { query, page },
            });
            set({
                movies: response.data.results,
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                loading: false,
            });
        } catch (_error) {
            set({ error: 'Failed to search movies', loading: false });
        }
    },
    fetchMovieDetails: async (id: number) => {
        try {
            set({ loading: true, error: null });
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

            set({ selectedMovie: movieDetails, loading: false });
        } catch (_error) {
            set({ error: 'Failed to fetch movie details', loading: false });
        }
    },
    clearSelectedMovie: () => set({ selectedMovie: null }),
})); 