import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { OvertimeRequestType } from '@/types/requests/ovetime';

export const overtimeService = {
    add: async (data: OvertimeRequestType[]): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.overtime}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: { records: data },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: number): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.overtime}?id=${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
