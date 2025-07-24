import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { JobtitleRequestType } from '@/types/requests/jobtitle';

export const jobtitleService = {
    add: async (data: JobtitleRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.jobtitle}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: JobtitleRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.jobtitle}`;
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
            const url = `/${urls.cache}/${urls.jobtitle}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
