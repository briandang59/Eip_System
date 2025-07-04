import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

import { AccountRoleRequest } from '@/types/requests/accountRole';

export const accountRoleService = {
    add: async (data: AccountRoleRequest): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.account_role}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (data: AccountRoleRequest): Promise<any> => {
        try {
            const url = `/${urls.permission_manage}/${urls.account_role}/`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
