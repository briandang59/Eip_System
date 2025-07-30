import { fetcher } from '../fetcher';

type RequestOptions = {
    params?: Record<string, string>;
    body?: any;
    headers?: HeadersInit;
    baseURL?: string;
    responseType?: 'blob' | 'json' | 'text' | 'arraybuffer';
};

function buildUrl(endpoint: string, params?: Record<string, string>): string {
    if (!params) return endpoint;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value);
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export const fetchAPI = {
    get: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        const response = await fetcher(url, {
            method: 'GET',
            headers: options.headers,
            baseURL: options.baseURL,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (options.responseType === 'blob') {
            return (await response.blob()) as unknown as T;
        }

        const text = await response.text();
        return JSON.parse(text) as T;
    },

    post: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);

        const isFormData = options.body instanceof FormData;

        return fetcher(url, {
            method: 'POST',
            body: isFormData ? options.body : JSON.stringify(options.body),
            baseURL: options.baseURL,
            headers: {
                ...options.headers,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            },
        });
    },

    put: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        const isFormData = options.body instanceof FormData;

        return fetcher(url, {
            method: 'PUT',
            body: isFormData ? options.body : JSON.stringify(options.body),
            baseURL: options.baseURL,
            headers: {
                ...options.headers,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            },
        });
    },

    delete: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        return fetcher(url, {
            method: 'DELETE',
            body: JSON.stringify(options.body),
            baseURL: options.baseURL,
            headers: options.headers,
        });
    },

    patch: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        const isFormData = options.body instanceof FormData;

        return fetcher(url, {
            method: 'PATCH',
            body: isFormData ? options.body : JSON.stringify(options.body),
            baseURL: options.baseURL,
            headers: {
                ...options.headers,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            },
        });
    },
};
