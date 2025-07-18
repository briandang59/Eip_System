import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { ResignRequestType } from '@/types/requests/resign';

export const resignService = {
    add: async (data: ResignRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.resign}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
