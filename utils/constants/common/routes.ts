export const routes = {
    home: '/',
    login: '/login',
    dashboard: {
        root: '/dashboard',
        dailyAttendanceStatistics: '/dashboard/daily-attendaces-statistics',
    },
    hr: {
        root: '/hr',
        employees: '/hr/employees',
        shiftScheduling: '/hr/shift-scheduling',
        takeLeave: '/hr/take-leave',
        overtime: '/hr/overtime',
        baseSalary: '/hr/base-salary',
        socialInsurance: '/hr/social-insurance',
        contract: '/hr/contract',
        workday: '/hr/workday',
        statisticalWorkday: '/hr/statistical-workday',
        utils: '/hr/utils',
        printCard: '/hr/print-card',
        workdayV1: '/hr/workday/v1',
        statisticalWorkdayV1: '/hr/statistical-workday/v1',
        reports: '/hr/reports',
        reportsV1: '/hr/reports/v1',
    },
    factoryInspection: {
        root: '/factory-inspection',
    },
    it: {
        root: '/it',
        rolesAndPermissions: '/it/roles-and-permissions',
        trackingLog: '/it/tracking-log',
    },
    rd: {
        root: '/rd',
        fabric: '/rd/fabric',
    },
    iso: {
        root: '/iso',
        request_form: '/iso/request-form',
        form: '/iso/form',
    },
    bulletins: {
        root: '/bulletins',
        manageBulletins: '/bulletins/manage-bulletins',
    },
    others: {
        root: '/others',
        meeting: '/others/meeting',
    },
    settings: {
        root: '/settings',
        userInformation: '/settings/user-information',
        accountRole: '/settings/account-role',
        changePassword: '/settings/change-password',
    },
    logout: '/login',
};
