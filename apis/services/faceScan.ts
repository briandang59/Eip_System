import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';
import { FaceScanRequestType } from '@/types/requests/faceScan';

export const faceScanService = {
    get: async (data: FaceScanRequestType): Promise<any> => {
        try {
            const url = `/${urls.webpages}/${urls.face_scan}/${urls.parse_hikvision_photo}`;
            const response = await fetchAPI.post<BaseResponse<string>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
