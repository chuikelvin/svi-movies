import axios from 'axios';

const TMDB_BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
    },
});

export const imageBaseUrl = 'https://image.tmdb.org/t/p';

export const imageSizes = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original',
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original',
    },
};

export const getImageUrl = (path: string, size: string, type: 'poster' | 'backdrop' = 'poster') => {
    if (!path) return '';
    return `${imageBaseUrl}/${imageSizes[type][size]}${path}`;
}; 