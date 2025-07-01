import {
    BookUser,
    Calendar,
    CalendarCheck,
    ChartBar,
    ChartPie,
    Clock,
    Cloud,
    ContactRound,
    DollarSign,
    Factory,
    HardDrive,
    Home,
    ListCheck,
    LogOut,
    Presentation,
    Printer,
    Rocket,
    Server,
    Settings,
    Shield,
    ShieldUser,
    Lock,
    UserRound,
    Users,
    UserSearch,
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
                    '/',
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
                    <BookUser strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.shift_scheduling || 'Shift Scheduling',
                    'hr/shift-scheduling',
                    <Calendar strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.take_leave || 'Take Leave',
                    'hr/take-leave',
                    <CalendarCheck strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.overtime || 'Overtime',
                    'hr/overtime',
                    <Clock strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.base_salary || 'Base Salary',
                    'hr/base-salary',
                    <DollarSign strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.social_insurance || 'Social Insurance',
                    'hr/social-insurance',
                    <ShieldUser strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.contract || 'Contract',
                    'hr/contract',
                    <ContactRound strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.workday || 'Workday',
                    'hr/workday',
                    <ListCheck strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.statistical_workday || 'Statistical Workday',
                    'hr/statistical-workday',
                    <ChartPie strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.hr?.utils || 'Utils',
                    'hr/utils',
                    <Rocket strokeWidth={1.5} className="w-4 h-4" />,
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
                    <ListCheck strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.factory_inspection?.statistical_workday || 'Statistical Workday',
                    'hr/statistical-workday/v1',
                    <ChartPie strokeWidth={1.5} className="w-4 h-4" />,
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
            <HardDrive strokeWidth={1.5} className="w-4 h-4" />,
            [
                getItem(
                    t?.sidebar?.others?.meeting || 'Meeting',
                    'others/meeting',
                    <Presentation strokeWidth={1.5} className="w-4 h-4" />,
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
                    <UserSearch strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.settings?.account_role || 'Account Role',
                    'settings/account-role',
                    <UserRound strokeWidth={1.5} className="w-4 h-4" />,
                ),
                getItem(
                    t?.sidebar?.settings?.change_password || 'Change Password',
                    'settings/change-password',
                    <Lock strokeWidth={1.5} className="w-4 h-4" />,
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
