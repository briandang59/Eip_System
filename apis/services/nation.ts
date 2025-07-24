import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { NationRequestType } from '@/types/requests/nation';

export const nationService = {
    add: async (data: NationRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.nation}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: NationRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.nation}`;
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
            const url = `/${urls.cache}/${urls.nation}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
