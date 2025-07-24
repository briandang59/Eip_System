import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { EthnicRequestType } from '@/types/requests/ethnic';

export const ethnicService = {
    add: async (data: EthnicRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.ethnic}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: EthnicRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.ethnic}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: number): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.ethnic}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
