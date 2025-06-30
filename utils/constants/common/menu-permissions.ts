import { Roles } from './roles';

export const menuPermissions: Record<string, Roles[]> = {
    // Dashboard
    dashboard: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT, Roles.EMPLOYEE],
    'users/tom': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT, Roles.EMPLOYEE],

    // HR Section
    hr: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/employees': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/shift-scheduling': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/take-leave': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/work-attendance': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/overtime': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/base-salary': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/social-insurance': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/contract': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/workday': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/statistical-workday': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/utils': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/print-card': [Roles.SUPER_USER, Roles.HR_MANAGER],

    // Factory Inspection
    factoryInspection: [Roles.SUPER_USER, Roles.PRODUCTIVITY_SUPERVISOR],
    'hr/workday/v1': [Roles.SUPER_USER, Roles.PRODUCTIVITY_SUPERVISOR],
    'hr/statistical-workday/v1': [Roles.SUPER_USER, Roles.PRODUCTIVITY_SUPERVISOR],

    // IT Section
    it: [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR],
    'it/roles-and-permissions': [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR],
    'it/tracking-log': [
        Roles.SUPER_USER,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.PRODUCTIVITY_SUPERVISOR,
    ],

    // Others
    others: [Roles.SUPER_USER, Roles.MEETING_ROOM_USER],
    'others/meeting': [Roles.SUPER_USER, Roles.MEETING_ROOM_USER],

    // Settings
    settings: [Roles.SUPER_USER, Roles.EMPLOYEE],
    'settings/user-information': [Roles.SUPER_USER, Roles.EMPLOYEE],
    'settings/account-role': [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR],

    // Logout (available for all)
    logout: Object.values(Roles),
};
