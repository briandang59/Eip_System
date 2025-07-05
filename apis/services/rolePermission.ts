import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import {
    RolePermissionAddRequestType,
    RolePermissionRemoveRequestType,
} from '@/types/requests/rolePermission';

export const rolePermissionService = {
    add: async (data: RolePermissionAddRequestType): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.role_permission}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (data: RolePermissionRemoveRequestType): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.role_permission}/`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
