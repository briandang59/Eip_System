import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://10.1.1.155:5588';
export const AUTH_COOKIE = 'auth_token';

interface FetcherError extends Error {
    status?: number;
    info?: any;
}

const DEFAULT_TIMEOUT = 60000; // 60 seconds

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.') as FetcherError;
        error.status = response.status;

        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                Cookies.remove(AUTH_COOKIE);
                window.location.href = '/login';
            }
        }

        try {
            error.info = await response.json();
            // Add more specific error message if available
            if (error.info?.message) {
                error.message = error.info.message;
            }
        } catch {
            error.info = await response.text();
        }
        throw error;
    }

    try {
        return await response.json();
    } catch (error) {
        // Handle empty response
        if (response.status === 204) {
            return null;
        }
        throw error;
    }
}

export const fetcher = async (url: string, init?: RequestInit, timeout?: number) => {
    const token = typeof window !== 'undefined' ? Cookies.get(AUTH_COOKIE) : null;
    console.log('🔍 Fetcher - Token from cookie:', token);
    console.log(
        '🔍 Fetcher - All cookies:',
        typeof window !== 'undefined' ? document.cookie : 'Server side',
    );

    const isFormData = init?.body instanceof FormData;

    const headers: HeadersInit = {
        ...(token && { Authorization: `${token}` }),
        ...(init?.headers || {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Accept: '*/*',
    };

    console.log('🔍 Fetcher - Headers:', headers);

    const config: RequestInit = {
        ...init,
        headers,
        mode: 'cors',
    };

    const requestTimeout = timeout || DEFAULT_TIMEOUT;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        const response = await fetch(`${baseURL}${url}`, {
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
            // Log network errors for debugging
            console.error('Network Error:', error);
            throw error;
        }
        throw new Error('Network error');
    }
};

export const fetcherWithBody = async <T>(url: string, { arg }: { arg: any }): Promise<T> => {
    return fetcher(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
};

export default fetcher;
