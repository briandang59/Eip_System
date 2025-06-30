import { urls } from '@/utils/constants/common/urls';
import { fetchAPI } from '../fetchAPI';
import { AuthSignInRequest, AuthResponse } from '@/types/response/auth';
import { BaseResponse } from '@/types/response/baseResponse';
import { ChangePasswordRequest } from '@/types/requests/auth';

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
    changePassword: async (data: ChangePasswordRequest): Promise<BaseResponse<any>> => {
        try {
            const response = await fetchAPI.patch<BaseResponse<any>>(
                `/${urls.user}/${urls.password}`,
                {
                    body: data,
                },
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};
