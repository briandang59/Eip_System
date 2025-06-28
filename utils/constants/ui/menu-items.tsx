import {
    Calendar,
    ChartBar,
    Clock,
    Cloud,
    Factory,
    Home,
    LogOut,
    Printer,
    Server,
    Settings,
    Shield,
    User,
    Users,
} from 'lucide-react';
import type { MenuProps } from 'antd';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

export const useMenuItems = (): MenuItem[] => {
    const { t } = useTranslationCustom();

    return [
        getItem(
            t?.sidebar?.home || 'Home',
            'dashboard',
            <Home strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    'Daily Attendance Statistics',
                    'users/tom',
                    <ChartBar strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.hr?.title || 'Human Resources',
            'hr',
            <Users strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.hr?.employees || 'Employees',
                    'hr/employees',
                    <User strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.shift_scheduling || 'Shift Scheduling',
                    'hr/shift-scheduling',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.take_leave || 'Take Leave',
                    'hr/take-leave',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.work_attendance || 'Work Attendance',
                    'hr/work-attendance',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.overtime || 'Overtime',
                    'hr/overtime',
                    <Clock strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.base_salary || 'Base Salary',
                    'hr/base-salary',
                    <Clock strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.social_insurance || 'Social Insurance',
                    'hr/social-insurance',
                    <Clock strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.contract || 'Contract',
                    'hr/contract',
                    <Clock strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.workday || 'Workday',
                    'hr/workday',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.statistical_workday || 'Statistical Workday',
                    'hr/statistical-workday',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.utils || 'Utils',
                    'hr/utils',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.print_card || 'Print Card',
                    'hr/print-card',
                    <Printer strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.factory_inspection?.title || 'Factory Inspection',
            'factoryInspection',
            <Factory strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.factory_inspection?.workday || 'Workday',
                    'hr/workday/v1',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.factory_inspection?.statistical_workday || 'Statistical Workday',
                    'hr/statistical-workday/v1',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.it?.title || 'IT',
            'it',
            <Server strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.it?.roles_permissions || 'Roles and Permissions',
                    'it/roles-and-permissions',
                    <Shield strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.it?.tracking_log || 'Tracking Log',
                    'it/tracking-log',
                    <Cloud strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.others?.title || 'Others',
            'others',
            <Calendar strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.others?.meeting || 'Meeting',
                    'others/meeting',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.settings?.title || 'Settings',
            'settings',
            <Settings strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.settings?.user_information || 'User Information',
                    'settings/user-information',
                    <ChartBar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.settings?.account_role || 'Account Role',
                    'settings/account-role',
                    <ChartBar strokeWidth={1.5} className="w-4 h-4" />,
                ),
            ],
        ),
        getItem(
            t?.sidebar?.logout || 'Logout',
            'logout',
            <LogOut strokeWidth={1.5} className="w-4 h-4" />,
        ),
    ];
};
