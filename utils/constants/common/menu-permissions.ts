import { Roles } from './roles';

export const menuPermissions: Record<string, Roles[]> = {
    // Dashboard
    home: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT, Roles.EMPLOYEE],
    '/': [
        Roles.SUPER_USER,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.EMPLOYEE,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],

    dashboard: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'dashboard/daily-attendaces-statistics': [
        Roles.SUPER_USER,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
    ],
    // HR Section
    hr: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/employees': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/shift-scheduling': [
        Roles.SUPER_USER,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],
    'hr/take-leave': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/overtime': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/base-salary': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/social-insurance': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/contract': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/workday': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/statistical-workday': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/utils': [Roles.SUPER_USER, Roles.HR_MANAGER],
    'hr/print-card': [Roles.SUPER_USER, Roles.HR_MANAGER],

    // Factory Inspection
    factoryInspection: [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/workday/v1': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/statistical-workday/v1': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    'hr/reports': [Roles.SUPER_USER, Roles.HR_MANAGER, Roles.HR_ASSISTANT],
    // IT Section
    it: [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR],
    'it/roles-and-permissions': [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR],
    'it/tracking-log': [
        Roles.SUPER_USER,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.PRODUCTIVITY_SUPERVISOR,
    ],
    rd: [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR, Roles.FABRIC_EXPERIMENT_MANAGER],
    'rd/fabric': [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR, Roles.FABRIC_EXPERIMENT_MANAGER],

    iso: [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR, Roles.FABRIC_EXPERIMENT_MANAGER],
    'iso/request-form': [
        Roles.EMPLOYEE,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.PRODUCTIVITY_SUPERVISOR,
        Roles.MEETING_ROOM_USER,
        Roles.SUPER_USER,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
        Roles.FABRIC_EXPERIMENT_MANAGER,
        Roles.FORM_MANAGER,
    ],
    'iso/form': [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR, Roles.FORM_MANAGER],

    bulletins: [Roles.SUPER_USER, Roles.SYSTEM_ADMINISTRATOR, Roles.BULLETINS_BOARD_MANAGER],
    'bulletins/manage-bulletins': [
        Roles.SUPER_USER,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.BULLETINS_BOARD_MANAGER,
    ],
    // Allow all roles to access bulletin detail pages
    'bulletins/[uuid]': Object.values(Roles),

    // Others
    others: [Roles.SUPER_USER, Roles.MEETING_ROOM_USER],
    'others/meeting': [Roles.SUPER_USER, Roles.MEETING_ROOM_USER],

    // Settings
    settings: [
        Roles.EMPLOYEE,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.PRODUCTIVITY_SUPERVISOR,
        Roles.MEETING_ROOM_USER,
        Roles.SUPER_USER,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],
    'settings/user-information': [
        Roles.EMPLOYEE,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.PRODUCTIVITY_SUPERVISOR,
        Roles.MEETING_ROOM_USER,
        Roles.SUPER_USER,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],
    'settings/account-role': [
        Roles.EMPLOYEE,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.PRODUCTIVITY_SUPERVISOR,
        Roles.MEETING_ROOM_USER,
        Roles.SUPER_USER,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],
    'settings/change-password': [
        Roles.EMPLOYEE,
        Roles.SYSTEM_ADMINISTRATOR,
        Roles.HR_MANAGER,
        Roles.HR_ASSISTANT,
        Roles.PRODUCTIVITY_SUPERVISOR,
        Roles.MEETING_ROOM_USER,
        Roles.SUPER_USER,
        Roles.DEPARTMENT_SHIFT_SCHEDULER,
    ],

    // Logout (available for all)
    logout: Object.values(Roles),
};
