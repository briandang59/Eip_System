import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { AccountRoleITResponse } from '@/types/response/accountRole';

const API_URL = `/${urls.permission_manage}/${urls.account_role}`;

interface filterParams {
    search?: string;
}
export const useAccountRoleIT = (params?: filterParams) => {
    const { data, error, mutate } = useSWR<BaseResponse<AccountRoleITResponse[]>>(
        API_URL,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    const keyword = params?.search?.trim().toLowerCase() ?? '';

    // 👇 helper: luôn trả về string
    const norm = (v?: string | null) => (v ?? '').trim().toLowerCase();

    const filterData = data?.data
        ?.filter(Boolean)
        .filter(
            (item) =>
                !keyword ||
                norm(item?.employee?.fullname).includes(keyword) ||
                norm(item?.employee?.card_number).includes(keyword),
        );

    return {
        accountRoles: filterData,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
