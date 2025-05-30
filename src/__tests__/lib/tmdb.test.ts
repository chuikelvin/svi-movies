import MockAdapter from 'axios-mock-adapter';
import {
    tmdbApi,
    getImageUrl,
    fetchPopularMovies,
    fetchPopularSeries,
    fetchKidsContent,
    createTmdbApi
} from '@/lib/tmdb';


describe('TMDB API Configuration', () => {
    it('should have correct base URL and authorization header', () => {
        const testApi = createTmdbApi('mock-token');
        expect(testApi.defaults.baseURL).toBe('https://api.themoviedb.org/3');
        expect(testApi.defaults.headers.Authorization).toBe('Bearer mock-token');
    });
});

describe('getImageUrl', () => {
    it('should return placeholder when path is empty', () => {
        expect(getImageUrl('', 'small')).toBe('/landscape-placeholder.svg');
    });

    it('should generate correct poster URLs', () => {
        const path = '/test-poster.jpg';
        expect(getImageUrl(path, 'small', 'poster')).toBe('https://image.tmdb.org/t/p/w185/test-poster.jpg');
        expect(getImageUrl(path, 'medium', 'poster')).toBe('https://image.tmdb.org/t/p/w342/test-poster.jpg');
        expect(getImageUrl(path, 'large', 'poster')).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');
        expect(getImageUrl(path, 'original', 'poster')).toBe('https://image.tmdb.org/t/p/original/test-poster.jpg');
    });

    it('should generate correct backdrop URLs', () => {
        const path = '/test-backdrop.jpg';
        expect(getImageUrl(path, 'small', 'backdrop')).toBe('https://image.tmdb.org/t/p/w300/test-backdrop.jpg');
        expect(getImageUrl(path, 'medium', 'backdrop')).toBe('https://image.tmdb.org/t/p/w780/test-backdrop.jpg');
        expect(getImageUrl(path, 'large', 'backdrop')).toBe('https://image.tmdb.org/t/p/w1280/test-backdrop.jpg');
        expect(getImageUrl(path, 'original', 'backdrop')).toBe('https://image.tmdb.org/t/p/original/test-backdrop.jpg');
    });
});

describe('API Functions', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(tmdbApi);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    describe('fetchPopularMovies', () => {
        it('should fetch popular movies with default page 1', async () => {
            const mockData = { results: [{ id: 1, title: 'Test Movie' }] };
            mockAxios.onGet('/movie/popular', { params: { page: 1 } }).reply(200, mockData);

            const result = await fetchPopularMovies();
            expect(result).toEqual(mockData);
        });

        it('should fetch popular movies with specified page', async () => {
            const mockData = { results: [{ id: 2, title: 'Test Movie 2' }] };
            mockAxios.onGet('/movie/popular', { params: { page: 2 } }).reply(200, mockData);

            const result = await fetchPopularMovies(2);
            expect(result).toEqual(mockData);
        });
    });

    describe('fetchPopularSeries', () => {
        it('should fetch popular series with correct params', async () => {
            const mockData = { results: [{ id: 1, name: 'Test Series' }] };
            const expectedParams = {
                page: 1,
                sort_by: 'popularity.desc',
                'vote_average.gte': 7,
                'vote_count.gte': 800,
                with_genres: '18,16,10759,10765',
                without_genres: '10767',
                language: 'en-US',
                'first_air_date.gte': '2010-01-01'
            };

            mockAxios.onGet('/discover/tv', { params: expectedParams }).reply(200, mockData);

            const result = await fetchPopularSeries();
            expect(result).toEqual(mockData);
        });
    });

    describe('fetchKidsContent', () => {
        it('should fetch kids content with correct params', async () => {
            const mockData = { results: [{ id: 1, title: 'Kids Movie' }] };
            const expectedParams = {
                page: 1,
                certification_country: 'US',
                certification: 'G',
                sort_by: 'release_date.desc',
                'vote_average.gte': 6,
                'vote_count.gte': 100,
                with_genres: '16,10751',
                language: 'en-US'
            };

            mockAxios.onGet('/discover/movie', { params: expectedParams }).reply(200, mockData);

            const result = await fetchKidsContent();
            expect(result).toEqual(mockData);
        });
    });

    it('should handle API errors', async () => {
        mockAxios.onGet('/movie/popular').networkError();

        await expect(fetchPopularMovies()).rejects.toThrow();
    });
});