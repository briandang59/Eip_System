import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

import { CreateShiftRequestType } from '@/types/requests/shiftType';

export const shiftListTypeService = {
    add: async (data: CreateShiftRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.list}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: CreateShiftRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.shift}/${urls.list}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
