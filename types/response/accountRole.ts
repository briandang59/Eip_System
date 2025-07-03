export type AccountRoleITResponse = {
    id: number;
    roles: {
        id: number;
        tag: string;
        description: string;
    };
    work_place: {
        id: number;
        name: string;
    };
    employee: {
        fullname: string;
        card_number: string;
    };
};
