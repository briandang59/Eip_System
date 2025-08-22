import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { SystemModeType } from '@/types/requests/systemMode';

export const systemModeService = {
    get: async (): Promise<any> => {
        try {
            const url = `/${urls.system}/${urls.mode}`;
            const response = await fetchAPI.get<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: SystemModeType): Promise<any> => {
        try {
            const url = `/${urls.system}/${urls.mode}/${urls.change}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
