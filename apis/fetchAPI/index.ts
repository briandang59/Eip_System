import { fetcher } from '../fetcher';

type RequestOptions = {
    params?: Record<string, string>;
    body?: any;
    headers?: HeadersInit;
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
        return fetcher(url, {
            method: 'GET',
            headers: options.headers,
        });
    },

    post: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);

        const isFormData = options.body instanceof FormData;

        return fetcher(url, {
            method: 'POST',
            body: isFormData ? options.body : JSON.stringify(options.body),
            headers: {
                ...options.headers,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            },
        });
    },

    put: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        return fetcher(url, {
            method: 'PUT',
            body: JSON.stringify(options.body),
            headers: options.headers,
        });
    },

    delete: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        return fetcher(url, {
            method: 'DELETE',
            body: JSON.stringify(options.body),
            headers: options.headers,
        });
    },

    patch: async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const url = buildUrl(endpoint, options.params);
        return fetcher(url, {
            method: 'PATCH',
            body: JSON.stringify(options.body),
            headers: options.headers,
        });
    },
};
