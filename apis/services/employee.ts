import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { CreateEmployeeRequest } from '@/types/requests/profileEmployee';
import { CreateSpeakLanguageRequestType } from '@/types/requests/speakLanguage';

export const employeeService = {
    add: async (data: CreateEmployeeRequest): Promise<any> => {
        try {
            const url = `/${urls.employee}/${urls.append_employee}`;
            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (data: CreateEmployeeRequest): Promise<any> => {
        try {
            const url = `/${urls.employee}/`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    upload_image: async (card_number: string, file: File): Promise<any> => {
        try {
            if (!(file instanceof File)) {
                throw new Error('Invalid file input');
            }

            const formData = new FormData();
            formData.append('card_number', card_number);
            formData.append('file', file);

            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetchAPI.post<BaseResponse<any>>(
                `/${urls.hr}/${urls.member_data}/${urls.photo}`,
                {
                    body: formData,
                },
            );

            return response.data;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    add_speak_languages: async (data: CreateSpeakLanguageRequestType): Promise<any> => {
        try {
            const url = `/${urls.employee}/${urls.speak_languages}`;

            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remove_speake_language: async (card_number: string, language_id: number): Promise<any> => {
        try {
            const url = `/${urls.employee}/${urls.speak_languages}?card_number=${card_number}&language_id=${language_id}`;

            const response = await fetchAPI.delete<BaseResponse<any>>(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
