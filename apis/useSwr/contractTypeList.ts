import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { ContractTypeListResponseType } from '@/types/response/contractTypeList';

const API_URL = `/${urls.hr}/${urls.contract}/${urls.type}/${urls.list}`;

export const useContractTypeList = () => {
    const { data, error, mutate } = useSWR<BaseResponse<ContractTypeListResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        contractTypeList: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
