import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { PromoteRequestType } from '@/types/requests/promote';

export const transferService = {
    add: async (data: PromoteRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.transfer}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
