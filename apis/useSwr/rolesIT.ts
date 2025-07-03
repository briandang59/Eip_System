import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { RoleITResponseType } from '@/types/response/roleIT';

const API_URL = `/${urls.permission_manage}/${urls.roles}`;

interface filterParams {
    search?: string;
}
export const useRolesIT = (params?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<RoleITResponseType[]>>(
        `${API_URL}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );
    const keyword = params?.search?.trim().toLowerCase() ?? '';

    const filterData = data?.data
        ?.filter(Boolean)
        .filter(
            (item) =>
                !keyword ||
                item.tag.trim().toLowerCase().includes(keyword) ||
                item.name_en.trim().toLowerCase().includes(keyword) ||
                item.name_vn.trim().toLowerCase().includes(keyword) ||
                item.name_zh.trim().toLowerCase().includes(keyword),
        );

    return {
        roles: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
