import fetcher from '@/apis/fetcher';

export const customFetcher = (url: string) =>
    fetcher(url, {
        baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
    });
