import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { ReinstateRequestType } from '@/types/requests/reinstatement';

export const reinstateService = {
    add: async (data: ReinstateRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.daily}/${urls.reinstatement}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
