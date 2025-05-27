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

export const fetchPopularMovies = async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/popular', {
        params: { page }
    });
    return response.data;
};

export const fetchPopularSeries = async (page: number = 1) => {
    const response = await tmdbApi.get('/discover/tv', {
        params: {
            page,
            sort_by: 'popularity.desc',
            'vote_average.gte': 7,
            'vote_count.gte': 800,
            with_genres: '18,16,10759,10765', // Drama, Animation, Action & Adventure, Sci-Fi & Fantasy
            without_genres: '10767',
            language: 'en-US',
            'first_air_date.gte': '2010-01-01'
        }
    });
    return response.data;
};

export const fetchKidsContent = async (page: number = 1) => {
    const response = await tmdbApi.get('/discover/movie', {
        params: {
            page,
            certification_country: 'US',
            certification: 'G',
            sort_by: 'release_date.desc',
            'vote_average.gte': 6,
            'vote_count.gte': 100,
            with_genres: '16,10751', // Animation and Family genres
            language: 'en-US'
        }
    });
    return response.data;
}; 