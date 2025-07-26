import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

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
};
