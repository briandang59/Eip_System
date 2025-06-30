export type AuthSignInRequest = {
    account: string;
    password: string;
};

export type ChangePasswordRequest = {
    old_password: string;
    new_password: string;
};
