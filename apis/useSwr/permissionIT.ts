import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { PermisisonITResponse } from '@/types/response/permissionIT';

const API_URL = `/${urls.permission_manage}/${urls.permissions}`;

interface filterParams {
    search?: string;
}
export const usePermissionIT = (params?: { search?: string }) => {
    const { data, error, mutate } = useSWR<BaseResponse<PermisisonITResponse[]>>(API_URL, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    const keyword = params?.search?.trim().toLowerCase() ?? '';

    // 👇 helper: luôn trả về string
    const norm = (v?: string | null) => (v ?? '').trim().toLowerCase();

    const filterData = data?.data
        ?.filter(Boolean)
        .filter(
            (item) =>
                !keyword ||
                norm(item.tag).includes(keyword) ||
                norm(item.permission_type?.name_en).includes(keyword) ||
                norm(item.permission_type?.name_vn).includes(keyword) ||
                norm(item.permission_type?.name_zh).includes(keyword),
        );

    return {
        permissions: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
