'use client';

import {
    BriefcaseBusiness,
    Calendar,
    Flag,
    GraduationCap,
    Phone,
    Scroll,
    ShieldCheck,
    User as UserIcon,
} from 'lucide-react';
import { EmployeeResponseType } from '@/types/response/employees';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { useMemberDataPhoto } from '@/apis/useSwr/photo';
import Image from 'next/image';
import { Spin } from 'antd';

interface ProfileUIProps {
    employee?: EmployeeResponseType;
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon?: React.ElementType;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <li className="flex items-center gap-4">
            {Icon && <Icon strokeWidth={1.5} className="text-green-700 shrink-0" />}
            <div className="flex flex-col gap-[2px]">
                <p className="text-gray-400">{label}</p>
                <p className="font-bold break-all">{value ?? '-'}</p>
            </div>
        </li>
    );
}

function Section({
    title,
    icon: Icon,
    rows,
    cols = 2,
}: {
    title: string;
    icon: React.ElementType;
    rows: { label: string; value: React.ReactNode }[];
    cols?: number;
}) {
    return (
        <div className="flex flex-col gap-4 shadow-sm p-4 bg-white">
            <h2 className="text-[20px] text-green-700 font-medium flex items-center gap-2">
                <Icon /> <span>{title}</span>
            </h2>
            <ul className={`grid gap-4 w-full grid-cols-${cols}`.replace('--', '-')}>
                {rows.map(({ label, value }) => (
                    <InfoRow key={label} label={label} value={value} />
                ))}
            </ul>
        </div>
    );
}

export default function ProfileUI({ employee }: ProfileUIProps) {
    const { t } = useTranslationCustom();

    // ✅ Hook phải được gọi ở đầu
    const { photos, isLoading } = useMemberDataPhoto({
        card_number: employee?.card_number ?? '',
    });

    if (!employee) return null;

    const basicRows = [
        {
            icon: UserIcon,
            label: t.user_information.gender,
            value: employee.gender ? 'Male' : 'Female',
        },
        { icon: Calendar, label: t.user_information.birthday, value: employee.birthday },
        { icon: Flag, label: t.user_information.nationality, value: employee.nation?.name_en },
        {
            icon: GraduationCap,
            label: t.user_information.education,
            value: employee.education?.name_en,
        },
    ];

    const contactRows = [
        { label: t.user_information.phone, value: employee.phone_vientnam },
        { label: t.user_information.address, value: employee.address },
        { label: t.user_information.id_card_number, value: employee.id_card_number },
        { label: t.user_information.place_of_birth, value: employee.place_of_birth },
        { label: t.user_information.ethnic, value: employee.ethnic?.name_en },
        { label: t.user_information.marriage, value: employee.marriage_status ? 'Yes' : 'No' },
        { label: t.user_information.pregnant_woman, value: employee.pregnancy ? 'Yes' : 'No' },
        {
            label: t.user_information.children,
            value: employee.is_taking_care_children ? 'Yes' : 'No',
        },
    ];

    const jobRows = [
        { label: t.user_information.job_class, value: employee.job_title?.name_en },
        { label: t.user_information.workplace, value: employee.work_place?.name_en },
        { label: t.user_information.job_title, value: employee.job_title?.name_en },
        { label: t.user_information.unit, value: employee.unit?.name_en },
        { label: t.user_information.work_description, value: employee.work_description },
        {
            label: t.user_information.languages,
            value: employee.speak_languages?.languages?.name_vn,
        },
    ];

    const insuranceRows = [
        { label: t.user_information.join_insurance, value: employee.account_id },
        { label: t.user_information.with_holding_date, value: '-' },
    ];

    const contractRows = [
        { label: t.user_information.contract_effect, value: employee.contract?.effect_date },
        { label: t.user_information.contract_expire, value: employee.contract?.expir_date },
        { label: t.user_information.date_join_company, value: employee.join_company_date1 },
        { label: t.user_information.date_join_company2, value: employee.join_company_date2 },
    ];

    return (
        <div className="grid grid-cols-[30%_70%] gap-4 bg-gray-50">
            <div className="rounded-[10px] p-4 flex flex-col items-center gap-4 shadow-sm bg-white">
                <div className="rounded-full size-[150px] flex items-center justify-center bg-gray-800">
                    {isLoading ? (
                        <Spin />
                    ) : photos ? (
                        <Image
                            width={150}
                            height={150}
                            alt="Employee photo"
                            src={`data:image/jpeg;base64,${photos}`}
                            unoptimized
                            className="rounded-full size-[150px] object-cover"
                        />
                    ) : (
                        <UserIcon className="text-white" width={80} height={80} strokeWidth={1.5} />
                    )}
                </div>

                <h2 className="text-[20px] font-bold">{employee.fullname}</h2>
                <h2 className="text-[16px] font-medium">{employee.fullname_other}</h2>
                <p className="p-2 rounded-full w-full bg-gray-100 font-bold">
                    {t.user_information.card_number}: {employee.card_number ?? '-'}
                </p>
                <ul className="flex flex-col gap-4 w-full">
                    {basicRows.map(({ icon, label, value }) => (
                        <InfoRow key={label} icon={icon} label={label} value={value} />
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-4">
                <Section
                    title={t.user_information.contact_information}
                    icon={Phone}
                    rows={contactRows}
                />
                <Section
                    title={t.user_information.job_information}
                    icon={BriefcaseBusiness}
                    rows={jobRows}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Section
                        title={t.user_information.insurance_information}
                        icon={ShieldCheck}
                        rows={insuranceRows}
                        cols={2}
                    />
                    <Section
                        title={t.user_information.contract_information}
                        icon={Scroll}
                        rows={contractRows}
                        cols={2}
                    />
                </div>
            </div>
        </div>
    );
}
