import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

import {
    AttendanceCreateRequestType,
    AttendanceUpdateRequestType,
} from '@/types/requests/attendance';

export const attendanceService = {
    add: async (data: AttendanceCreateRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.attendance}/${urls.append}/${urls.record}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (data: AttendanceUpdateRequestType): Promise<any> => {
        try {
            const url = `/${urls.hr}/${urls.attendance}/${urls.modify}/${urls.record}`;

            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
