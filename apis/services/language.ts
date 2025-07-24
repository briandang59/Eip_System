import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { LanguageRequestType } from '@/types/requests/language';

export const languageService = {
    add: async (data: LanguageRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.language}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: LanguageRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.language}`;
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
            const url = `/${urls.cache}/${urls.language}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
