export const routes = {
    home: '/',
    login: '/login',
    hr:{
        root: '/hr',
        employees: '/hr/employees',
        shiftScheduling: '/hr/shift-scheduling',
        takeLeave: '/hr/take-leave',
        workAttendance: '/hr/work-attendance',
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
    },
    factoryInspection:{
        root: '/factory-inspection',
    },
    it:{
        root: '/it',
        rolesAndPermissions: '/it/roles-and-permissions',
        trackingLog: '/it/tracking-log',
    },
    others:{
        root: '/others',
        meeting: '/others/meeting',
    },
    settings:{
        root: '/settings',
        userInformation: '/settings/user-information',
        accountRole: '/settings/account-role',
    },
    logout: '/logout',
}