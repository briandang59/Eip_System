'use client';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { Tabs } from 'antd';
import {
    Book,
    Briefcase,
    CalendarDays,
    CalendarSync,
    Flag,
    Globe,
    HouseWifi,
    UserCog,
    Users,
} from 'lucide-react';
import Department from '@/components/ui/department';
import Dormitories from '@/components/ui/dormitories';
import JobTitles from '@/components/ui/jobTitles';
import Nationalities from '@/components/ui/nationalities';
import NationalHolidays from '@/components/ui/nationalHolidays';
import ShiftTypes from '@/components/ui/shiftTypes';
import Languages from '@/components/ui/languages';
import Ethnicities from '@/components/ui/ethnicities';
import Educations from '@/components/ui/educations';

function UtilsPage() {
    const { t } = useTranslationCustom();
    const tabs = [
        {
            key: '1',
            label: t.utils.departments,
            children: <Department />,
            icon: <UserCog strokeWidth={1.5} />,
        },
        {
            key: '2',
            label: t.utils.dormitories,
            children: <Dormitories />,
            icon: <HouseWifi strokeWidth={1.5} />,
        },
        {
            key: '3',
            label: t.utils.job_titles,
            children: <JobTitles />,
            icon: <Briefcase strokeWidth={1.5} />,
        },
        {
            key: '4',
            label: t.utils.nationalities,
            children: <Nationalities />,
            icon: <Flag strokeWidth={1.5} />,
        },
        {
            key: '5',
            label: t.utils.national_holidays,
            children: <NationalHolidays />,
            icon: <CalendarDays strokeWidth={1.5} />,
        },
        {
            key: '6',
            label: t.utils.shift_types,
            children: <ShiftTypes />,
            icon: <CalendarSync strokeWidth={1.5} />,
        },
        {
            key: '7',
            label: t.utils.languages,
            children: <Languages />,
            icon: <Globe strokeWidth={1.5} />,
        },
        {
            key: '8',
            label: t.utils.education,
            children: <Educations />,
            icon: <Book strokeWidth={1.5} />,
        },
        {
            key: '9',
            label: t.utils.ethnicities,
            children: <Ethnicities />,
            icon: <Users strokeWidth={1.5} />,
        },
    ];
    return <Tabs defaultActiveKey="1" items={tabs} />;
}

export default UtilsPage;
