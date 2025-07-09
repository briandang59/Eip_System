import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

import {
    ShiftCreateRequestType,
    ShiftDeleteRequestType,
    ShiftModifyRequestType,
} from '@/types/requests/shift';

export const shiftService = {
    add: async (data: ShiftCreateRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.shift}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: ShiftModifyRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.range_date}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (data: ShiftDeleteRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.range_date}?card_number=${data.card_number}&start_date=${data.start_date}&end_date=${data.end_date}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
