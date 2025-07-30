import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { BulletinsCreateRequestType, BulletinsModifyRequestType } from '@/types/requests/bulletins';
import { DownLoadFileResponseType } from '@/types/response/download';

const baseUrl = process.env.NEXT_PUBLIC_API_URL_2 || 'http://10.2.1.159:4499';
export const bulletinsService = {
    add: async (data: BulletinsCreateRequestType): Promise<any> => {
        try {
            const url = `/${urls.manage}/${urls.bulletins}`;
            const formData = new FormData();

            formData.append('title_vn', data.title_vn);
            formData.append('title_en', data.title_en);
            formData.append('title_zh', data.title_zh);
            formData.append('content_vn', data.content_vn);
            formData.append('content_en', data.content_en);
            formData.append('content_zh', data.content_zh);
            formData.append('start_date', data.start_date);
            formData.append('end_date', data.end_date);
            formData.append('work_places', JSON.stringify(data.work_places));
            formData.append('is_global', String(data.is_global));
            formData.append('is_pinned', String(false));

            if (Array.isArray(data.files)) {
                data.files.forEach((file: File) => {
                    formData.append('files', file);
                });
            }

            const response = await fetchAPI.post<BaseResponse<any>>(url, {
                body: formData,
                baseURL: baseUrl,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modify: async (data: Partial<BulletinsModifyRequestType>, id: string): Promise<any> => {
        try {
            const url = `/${urls.manage}/${urls.bulletins}/${id}`;
            const formData = new FormData();
            console.log('Data received in modify:', data);

            // Duyệt từng key nếu tồn tại trong data thì append
            if (data.title_vn !== undefined) formData.append('title_vn', data.title_vn);
            if (data.title_en !== undefined) formData.append('title_en', data.title_en);
            if (data.title_zh !== undefined) formData.append('title_zh', data.title_zh);
            if (data.content_vn !== undefined) formData.append('content_vn', data.content_vn);
            if (data.content_en !== undefined) formData.append('content_en', data.content_en);
            if (data.content_zh !== undefined) formData.append('content_zh', data.content_zh);
            if (data.start_date !== undefined) formData.append('start_date', data.start_date);
            if (data.end_date !== undefined) formData.append('end_date', data.end_date);
            if (data.work_places !== undefined)
                formData.append('work_places', JSON.stringify(data.work_places));
            if (data.is_global !== undefined) formData.append('is_global', String(data.is_global));
            if (data.is_pinned !== undefined) formData.append('is_pinned', String(data.is_pinned));

            if (Array.isArray(data.files)) {
                data.files.forEach((file: File) => {
                    formData.append('files', file);
                });
            }

            // Log nội dung FormData
            for (const [key, value] of formData.entries()) {
                console.log(`FormData - ${key}: ${value}`);
            }

            const response = await fetchAPI.put<BaseResponse<any>>(url, {
                body: formData,
                baseURL: baseUrl,
            });

            return response.data;
        } catch (error) {
            console.error('Modify error:', error);
            throw error;
        }
    },

    remove: async (id: string): Promise<any> => {
        try {
            const url = `/${urls.manage}/${urls.bulletins}/${id}`;
            const response = await fetchAPI.delete<BaseResponse<any>>(url, {
                baseURL: baseUrl,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    download: async (file_name: string): Promise<DownLoadFileResponseType> => {
        try {
            const url = `/${urls.manage}/${urls.bulletins}/${urls.download}/${file_name}`;
            const response = await fetchAPI.get(url, {
                baseURL: baseUrl,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
};
