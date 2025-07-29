import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { BaseResponse } from '@/types/response/baseResponse';

interface ModifyLangProps {
    language: string;
}
export const languagePreferencesService = {
    modify: async (data: ModifyLangProps): Promise<any> => {
        try {
            const url = `/${urls.system}/${urls.user_preferences}`;
            const response = await fetchAPI.patch<BaseResponse<any>>(url, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
