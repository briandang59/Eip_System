import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

import { ShiftCreateRequestType } from '@/types/requests/shift';

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
};
