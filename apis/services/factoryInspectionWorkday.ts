import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { FactoryInspectionWorkdayEditRequest } from '@/types/requests/factoryInspectionWorkday';

export const factoryInspectionWorkdayService = {
    modify: async (data: FactoryInspectionWorkdayEditRequest): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.factory_inspection}/${urls.attendance}/${urls.summary_v2}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
