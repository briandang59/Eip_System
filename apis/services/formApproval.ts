import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { ApproveRequestType } from '@/types/requests/approve';

export const formApprovalService = {
    approve: async (id: string, data: ApproveRequestType): Promise<any> => {
        try {
            const url = `/${urls.form_approval}/${id}`;
            const response = await fetchAPI.put<BaseResponse<any>>(url, {
                body: data,
                baseURL: process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499/api',
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
