import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { CreateBookingRequest } from '@/types/requests/booking';

export const bookingService = {
    add: async (data: CreateBookingRequest): Promise<any> => {
        try {
            const url = `/${urls.meeting}/${urls.book}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
