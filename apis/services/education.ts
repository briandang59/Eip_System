import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { EducationRequestType } from '@/types/requests/education';

export const educationService = {
    add: async (data: EducationRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.education}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: EducationRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.education}`;
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
            const url = `/${urls.cache}/${urls.education}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
