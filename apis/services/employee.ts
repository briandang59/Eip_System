import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { CreateEmployeeRequest } from '@/types/requests/profileEmployee';

export const employeeService = {
    add: async (data: CreateEmployeeRequest[]): Promise<any> => {
        try {
            const url = `/${urls.employee}/${urls.append_employee}/`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: { records: data },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
