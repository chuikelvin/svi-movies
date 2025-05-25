import axios from 'axios';

const TMDB_BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
    },
});

const imageBaseUrl = 'https://image.tmdb.org/t/p';

type ImageSize = 'small' | 'medium' | 'large' | 'original';
type ImageType = 'poster' | 'backdrop';

const imageSizes: Record<ImageType, Record<ImageSize, string>> = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    }
};

export const getImageUrl = (path: string, size: ImageSize, type: ImageType = 'poster') => {
    if (!path) return '/landscape-placeholder.svg';
    return `${imageBaseUrl}/${imageSizes[type][size]}${path}`;
}; 