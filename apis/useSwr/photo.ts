import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';

const API_URL = `/${urls.hr}/${urls.member_data}/${urls.photo}`;

interface params {
    card_number: string;
}
export const useMemberDataPhoto = ({ card_number }: params) => {
    const { data, error, mutate } = useSWR<BaseResponse<string>>(
        `${API_URL}?card_number=${card_number}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        photos: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
