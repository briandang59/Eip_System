export type RolePermissionITResponse = {
    id: number;
    role_id: number;
    permissions: {
        id: number;
        tag: string;
        description: string;
    };
};
