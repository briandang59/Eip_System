import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { RoleRequestType } from '@/types/requests/role';

export const roleService = {
    add: async (data: RoleRequestType): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.roles}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (data: RoleRequestType): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.roles}?id=${data.id}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
