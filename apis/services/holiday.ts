import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { HolidayRequestType } from '@/types/requests/holiday';

export const holidayService = {
    add: async (data: HolidayRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.holiday}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: HolidayRequestType): Promise<any> => {
        try {
            const url = `/${urls.cache}/${urls.holiday}`;
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
            const url = `/${urls.cache}/${urls.holiday}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
