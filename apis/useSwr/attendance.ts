import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { AttendanceV2Type } from '@/types/response/attendance';

// Extended type với unique key
type AttendanceV2WithKey = AttendanceV2Type & { stt: string };

const API_URL = `/${urls.hr}/${urls.attendance}/${urls.summary_v2}`;

interface params {
    start: string;
    end: string;
    unit_id?: number;
    work_place_id?: number;
    card_number?: string;
}

const attendanceFetcher = (url: string, params: params) =>
    fetcher(
        url,
        {
            method: 'POST',
            body: JSON.stringify(params),
        },
        120000,
    );
interface filterParams {
    search?: string;
    unit_id?: number;
    tag_shift?: string;
    is_abnormal?: boolean;
}
export const useAttendanceV2 = (params: params, filterParams: filterParams) => {
    const swrKey = [API_URL, params] as const;
    const { data, error, mutate } = useSWR<BaseResponse<AttendanceV2Type[]>>(
        swrKey,
        () => attendanceFetcher(API_URL, params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            dedupingInterval: 10000,
        },
    );
    const matchesSearch = (item: AttendanceV2WithKey): boolean => {
        if (!filterParams.search) return true;

        const searchTerm = filterParams.search.toLowerCase().trim();
        const fullnameMatch = item.fullname.toLowerCase().includes(searchTerm);
        const cardNumberMatch = item.card_number.toLowerCase().includes(searchTerm);
        const shiftTagMatch = item?.details[0]?.shift?.tag?.toLowerCase().includes(searchTerm);

        // Sử dụng OR (||) để tìm kiếm theo bất kỳ trường nào
        return fullnameMatch || cardNumberMatch || shiftTagMatch;
    };

    const matchesUnit = (item: AttendanceV2WithKey): boolean => {
        return filterParams.unit_id ? item.unit.id === filterParams.unit_id : true;
    };

    const matchesAbnormalStatus = (item: AttendanceV2WithKey): boolean => {
        return filterParams.is_abnormal !== undefined
            ? item?.details?.length > 0 &&
                  item?.details[0]?.attendance?.length > 0 &&
                  item?.details[0]?.attendance[0]?.is_abnormal === filterParams.is_abnormal
            : true;
    };

    const isActiveEmployee = (item: AttendanceV2WithKey): boolean => {
        return item.active;
    };

    const filterActiveEmployee = (item: AttendanceV2WithKey) => {
        return filterParams.is_abnormal
            ? isActiveEmployee(item) &&
                  matchesSearch(item) &&
                  matchesUnit(item) &&
                  matchesAbnormalStatus(item)
            : isActiveEmployee(item) && matchesSearch(item) && matchesUnit(item);
    };

    const filterResignEmployee = (item: AttendanceV2WithKey) => {
        return !isActiveEmployee(item) && matchesSearch(item) && matchesUnit(item);
    };
    // Transform data: Tạo mỗi record cho 1 ngày
    const transformToDaily = (employees: AttendanceV2Type[]): AttendanceV2WithKey[] => {
        const dailyRecords: AttendanceV2WithKey[] = [];

        employees.forEach((employee, employeeIndex) => {
            employee.details.forEach((detail, detailIndex) => {
                const dailyRecord: AttendanceV2WithKey = {
                    ...employee,
                    details: [detail], // Chỉ giữ lại 1 ngày
                    // Tạo unique key kết hợp card_number + date
                    stt: `${employee.card_number}-${detail.date}`,
                };
                dailyRecords.push(dailyRecord);
            });
        });

        return dailyRecords;
    };

    const transformedData = data?.data ? transformToDaily(data.data) : [];
    const activeEmployee = transformedData?.filter(filterActiveEmployee);
    const resignEmployee = transformedData?.filter(filterResignEmployee);

    return {
        attendance: activeEmployee,
        resignEmployee,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
