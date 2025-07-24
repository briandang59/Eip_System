import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { CreateDormitoryRequestType } from '@/types/requests/dormitory';

export const dormitoryService = {
    add: async (data: CreateDormitoryRequestType): Promise<any> => {
        try {
            const url = `/${urls.basic_data}/${urls.dormitory}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: CreateDormitoryRequestType): Promise<any> => {
        try {
            const url = `/${urls.basic_data}/${urls.dormitory}/`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (id: number): Promise<any> => {
        try {
            const url = `/${urls.basic_data}/${urls.dormitory}/?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
