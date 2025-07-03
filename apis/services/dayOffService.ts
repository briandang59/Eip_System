import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { DayoffRequestType } from '@/types/requests/dayoff';

export const dayOffService = {
    add: async (data: DayoffRequestType[]): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.dayoff}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: { records: data },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
