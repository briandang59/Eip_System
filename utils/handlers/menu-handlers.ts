import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { routes } from '../constants/common/routes';
import Cookies from 'js-cookie';
import { AUTH_COOKIE } from '@/apis/fetcher';

const handleLogout = () => {
    localStorage.clear();
    Cookies.remove(AUTH_COOKIE);
    window.location.href = routes.logout;
};

export const handleMenuClick = (key: string, router: AppRouterInstance) => {
    switch (key) {
        case 'dashboard/daily-attendaces-statistics':
            router.push(routes.dashboard.dailyAttendanceStatistics);
            break;
        case 'hr/employees':
            router.push(routes.hr.employees);
            break;
        case 'hr/shift-scheduling':
            router.push(routes.hr.shiftScheduling);
            break;
        case 'hr/take-leave':
            router.push(routes.hr.takeLeave);
            break;

        case 'hr/overtime':
            router.push(routes.hr.overtime);
            break;
        case 'hr/base-salary':
            router.push(routes.hr.baseSalary);
            break;
        case 'hr/social-insurance':
            router.push(routes.hr.socialInsurance);
            break;
        case 'hr/contract':
            router.push(routes.hr.contract);
            break;
        case 'hr/workday':
            router.push(routes.hr.workday);
            break;
        case 'hr/statistical-workday':
            router.push(routes.hr.statisticalWorkday);
            break;
        case 'hr/utils':
            router.push(routes.hr.utils);
            break;
        case 'hr/print-card':
            router.push(routes.hr.printCard);
            break;
        case 'hr/workday/v1':
            router.push(routes.hr.workdayV1);
            break;
        case 'hr/statistical-workday/v1':
            router.push(routes.hr.statisticalWorkdayV1);
            break;
        case 'hr/reports':
            router.push(routes.hr.reports);
            break;
        case 'hr/reports/v1':
            router.push(routes.hr.reportsV1);
            break;
        case 'it/roles-and-permissions':
            router.push(routes.it.rolesAndPermissions);
            break;
        case 'it/tracking-log':
            router.push(routes.it.trackingLog);
            break;
        case 'rd/fabric':
            router.push(routes.rd.fabric);
            break;
        case 'iso/request-form':
            router.push(routes.iso.request_form);
            break;
        case 'iso/form':
            router.push(routes.iso.form);
            break;
        case 'bulletins/manage-bulletins':
            router.push(routes.bulletins.manageBulletins);
            break;

        case 'others/meeting':
            router.push(routes.others.meeting);
            break;
        case 'settings/user-information':
            router.push(routes.settings.userInformation);
            break;
        case 'settings/account-role':
            router.push(routes.settings.accountRole);
            break;
        case 'settings/change-password':
            router.push(routes.settings.changePassword);
            break;
        case 'settings/system-mode':
            router.push(routes.settings.systemMode);
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            router.push(routes.home);
    }
};
