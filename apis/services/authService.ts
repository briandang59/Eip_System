import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { AuthSignInRequest, AuthResponse } from '@/types/response/auth';
import { BaseResponse } from '@/types/response/baseResponse';

export const authService = {
    signin: async (data: AuthSignInRequest): Promise<AuthResponse> => {
        try {
            const response = await fetchAPI.post<BaseResponse<AuthResponse>>(urls.login, {
                body: data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
