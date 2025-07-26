import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

interface ModifyEmployeeRecordRequest {
    event_date: string;
    memo: string;
}
export const employeeRecordService = {
    modify: async (data: ModifyEmployeeRecordRequest, id: number): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.career}/${urls.record}?id=${id}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
