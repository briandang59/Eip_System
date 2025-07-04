import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { RolePermissionResponseType } from '@/types/response/rolePermission';

const API_URL = `/${urls.permission_manage}/${urls.role_permission}`;

export const useRolePermission = () => {
    const { data, error, mutate } = useSWR<BaseResponse<RolePermissionResponseType[]>>(
        API_URL,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        rolePermissions: data?.data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
