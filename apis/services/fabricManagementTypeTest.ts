import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { FabricTypesTestRequestType } from '@/types/requests/fabricTest';

export const fabricManagementTypeTestServices = {
    add: async (data: FabricTypesTestRequestType, code: string): Promise<any> => {
        try {
            const url = `/${urls.fabric_management}/${urls.types}/${code}/${urls.tests}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
