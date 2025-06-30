import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { fetcher, fetcherWithBody } from '../fetcher';

export const defaultConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
};

export function useSwrQuery<T>(
    url: string | null,
    config: SWRConfiguration = {},
): SWRResponse<T, Error> {
    return useSWR<T>(url, fetcher, {
        ...defaultConfig,
        ...config,
    });
}

export function useSwrMutation<T>(url: string, config: SWRConfiguration = {}) {
    return useSWR<T>(url, fetcherWithBody, {
        ...defaultConfig,
        ...config,
    });
}
