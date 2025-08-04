// fetcher.ts

import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://10.1.1.155:4430';
export const AUTH_COOKIE = 'auth_token';

interface FetcherError extends Error {
    status?: number;
    info?: any;
}

const DEFAULT_TIMEOUT = 60000;

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.') as FetcherError;
        error.status = response.status;

        if (response.status === 401 && typeof window !== 'undefined') {
            Cookies.remove(AUTH_COOKIE);
            window.location.href = '/login';
        }

        try {
            error.info = await response.json();
            if (error.info?.message) error.message = error.info.message;
        } catch {
            error.info = await response.text();
        }
        throw error;
    }

    try {
        return await response.json();
    } catch (error) {
        if (response.status === 204) return null;
        throw error;
    }
}

export const fetcher = async (
    url: string,
    init?: RequestInit & { baseURL?: string },
    timeout?: number,
) => {
    const token = typeof window !== 'undefined' ? Cookies.get(AUTH_COOKIE) : null;

    const isFormData = init?.body instanceof FormData;

    const selectedBaseURL = init?.baseURL || baseURL;
    const isSameBaseURL = selectedBaseURL === baseURL;

    const headers: HeadersInit = {
        ...(token && {
            Authorization: isSameBaseURL ? `${token}` : `Bearer ${token}`,
        }),
        ...(init?.headers || {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Accept: '*/*',
    };
    const config: RequestInit = {
        ...init,
        headers,
        mode: 'cors',
    };

    const requestTimeout = timeout || DEFAULT_TIMEOUT;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        const response = await fetch(`${selectedBaseURL}${url}`, {
            ...config,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout (${requestTimeout / 1000}s)`);
            }
            console.error('Network Error:', error);
            throw error;
        }
        throw new Error('Network error');
    }
};

export const fetcherWithBody = async <T>(
    url: string,
    {
        arg,
        baseURL,
    }: {
        arg: any;
        baseURL?: string;
    },
): Promise<T> => {
    return fetcher(url, {
        method: 'POST',
        body: JSON.stringify(arg),
        baseURL,
    });
};

export default fetcher;
