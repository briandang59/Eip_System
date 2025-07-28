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
    modify: async (data: FabricManagementTypeRequestType, code: string): Promise<any> => {
        try {
            const url = `/${urls.fabric_management}/${urls.types}/${code}`;
            const response = await fetchAPI.put<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (code: string): Promise<any> => {
        try {
            const url = `/${urls.fabric_management}/${urls.types}/${code}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
