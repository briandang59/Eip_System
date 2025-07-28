import { FabricManagementTypeRequestType } from '@/types/requests/fabricManagementType';
import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

export const fabricManagementTypeServices = {
    add: async (data: FabricManagementTypeRequestType): Promise<any> => {
        try {
            const url = `/${urls.fabric_management}/${urls.types}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
