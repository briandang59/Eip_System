import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { CreateBookingRequest, DeleteBookingRequest } from '@/types/requests/booking';

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
    modify: async (data: CreateBookingRequest): Promise<any> => {
        try {
            const url = `/${urls.meeting}/${urls.update_book}`;
            const response = await fetchAPI.put<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove: async (data: DeleteBookingRequest): Promise<any> => {
        try {
            const url = `/${urls.meeting}/${urls.active_off}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
