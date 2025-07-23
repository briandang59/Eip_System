import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { FactoryInspectionAttendance } from '@/types/response/factoryInspectionAttendance';
import { checkSunday } from '@/utils/functions/checkSunday';
import { calculateShiftHour } from '@/utils/functions/calculateShiftHour';
import { calculateFactoryInspectionStatisticalWorkday } from '@/utils/functions/calculateFactoryInspectionStatisticalWorkday';

// Extended type với unique key
type FactoryInspectionAttendanceWithKey = FactoryInspectionAttendance & { stt: string };

const API_URL = `/${urls.hr}/${urls.factory_inspection}/${urls.attendance}/${urls.summary_v2}`;

interface params {
    start: string;
    end: string;
    unit_id?: number;
    work_place_id: number;
    card_number?: string;
}

interface filterParams {
    search?: string;
    unit_id?: number;
    tag_shift?: string;
    is_abnormal?: boolean;
    year?: number;
    month?: number;
    status?: 'active' | 'resign' | 'all';
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

export const useFactoryInspectionAttendance = (params: params, filterParams?: filterParams) => {
    const swrKey = [API_URL, params] as const;
    const { data, error, mutate } = useSWR<BaseResponse<FactoryInspectionAttendance[]>>(
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

    const matchesSearch = (item: FactoryInspectionAttendanceWithKey): boolean => {
        if (!filterParams?.search) return true;

        const searchTerm = filterParams.search.toLowerCase().trim();

        const fullnameMatch = item.fullname.toLowerCase().includes(searchTerm);
        const cardNumberMatch = item.card_number.toLowerCase().includes(searchTerm);

        const shiftTagMatch = item.details[0]?.shift?.tag
            ? item.details[0].shift.tag.toLowerCase().includes(searchTerm)
            : false;

        return fullnameMatch || cardNumberMatch || shiftTagMatch;
    };

    const matchesUnit = (item: FactoryInspectionAttendanceWithKey): boolean => {
        return filterParams?.unit_id ? item.unit.id === filterParams.unit_id : true;
    };

    const matchesAbnormalStatus = (item: FactoryInspectionAttendanceWithKey): boolean => {
        const detail = item?.details[0];

        // Điều kiện 1: Có bất thường đã được đánh dấu
        const hasAbnormalFlags = detail?.attendance?.some(
            (attendanceItem) => attendanceItem?.is_abnormal,
        );

        // Điều kiện 2: Có ca làm (shift) nhưng không có dữ liệu chấm công đầy đủ
        const hasShift = detail?.shift !== null && detail?.workday?.KP > 0;

        // Điều kiện 3: Đã có dữ liệu chấm công nhưng chưa được xử lý
        const hasUnprocessedAttendance = detail?.attendance?.some(
            (attendanceItem) =>
                attendanceItem.abnormal_processing === false &&
                (attendanceItem.clockin === null || attendanceItem.clockout === null),
        );

        // Kiểm tra điều kiện cơ bản để có thể bất thường
        const isPotentialAbnormal = hasAbnormalFlags || hasShift || hasUnprocessedAttendance;

        if (!isPotentialAbnormal) {
            return false;
        }

        // Lọc abnormal processing
        const leave = detail?.workday?.leave_hours;
        const GC = detail?.workday?.GC || 0;
        const KP = detail?.workday?.KP || 0;
        const totalLeave =
            (leave?.A || 0) + (leave?.B || 0) + (leave?.C || 0) + (leave?.D || 0) + GC + KP;

        const shiftHours = detail?.shift ? calculateShiftHour(detail.shift) : 0;
        const isLeaveMoreThanShift = totalLeave > shiftHours;

        const abnormalProcessingResult =
            detail?.attendance?.every(
                (attendanceItem) => attendanceItem.abnormal_processing === false,
            ) &&
            (isLeaveMoreThanShift ||
                ((leave?.A || 0) === 0 &&
                    (leave?.B || 0) === 0 &&
                    (leave?.C || 0) === 0 &&
                    (leave?.D || 0) === 0 &&
                    KP > 0 &&
                    (detail?.workday?.GDem || 0) === 0));

        if (!abnormalProcessingResult) {
            return false;
        }

        // Lọc Sunday và Event
        const isSundayAndNoWork = checkSunday(detail?.date) && detail?.workday?.GC === 0;
        const isHolidayWithoutAttendance =
            detail?.holiday !== null &&
            !detail?.attendance?.some(
                (attendanceItem) =>
                    attendanceItem.clockin !== null || attendanceItem.clockout !== null,
            );

        // Trả về true nếu không phải Sunday không làm việc và không phải holiday không chấm công
        return !isSundayAndNoWork && !isHolidayWithoutAttendance;
    };

    const isActiveEmployee = (item: FactoryInspectionAttendanceWithKey): boolean => {
        return item.active;
    };

    const filterActiveEmployee = (item: FactoryInspectionAttendanceWithKey) => {
        return filterParams?.is_abnormal
            ? isActiveEmployee(item) &&
                  matchesSearch(item) &&
                  matchesUnit(item) &&
                  matchesAbnormalStatus(item)
            : isActiveEmployee(item) && matchesSearch(item) && matchesUnit(item);
    };

    const filterOriginData = (item: FactoryInspectionAttendanceWithKey) => {
        return filterParams?.is_abnormal
            ? matchesSearch(item) && matchesUnit(item) && matchesAbnormalStatus(item)
            : matchesSearch(item) && matchesUnit(item);
    };

    const filterResignEmployee = (item: FactoryInspectionAttendanceWithKey) => {
        return !isActiveEmployee(item) && matchesSearch(item) && matchesUnit(item);
    };

    // Transform data: Tạo mỗi record cho 1 ngày
    const transformToDaily = (
        employees: FactoryInspectionAttendance[],
    ): FactoryInspectionAttendanceWithKey[] => {
        const dailyRecords: FactoryInspectionAttendanceWithKey[] = [];

        employees.forEach((employee) => {
            employee.details.forEach((detail) => {
                const dailyRecord: FactoryInspectionAttendanceWithKey = {
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
    const originData = transformedData?.filter(filterOriginData);
    const activeEmployee = transformedData?.filter(filterActiveEmployee);
    const resignEmployee = transformedData?.filter(filterResignEmployee);
    const resignEmployeeWithMonth = resignEmployee.filter((item) => {
        if (item.resign_date) {
            const date = new Date(item.resign_date); // Tự parse từ chuỗi YYYY-MM-DD
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth: 0–11
            return month === filterParams?.month?.toString().padStart(2, '0');
        }
        return false;
    });

    const statisticalWorkday = calculateFactoryInspectionStatisticalWorkday(
        transformedData,
        filterParams?.year || 0,
        filterParams?.month || 0,
    );
    const statisticalWorkdayActive = calculateFactoryInspectionStatisticalWorkday(
        activeEmployee,
        filterParams?.year || 0,
        filterParams?.month || 0,
    );

    const statisticalWorkdayResign = calculateFactoryInspectionStatisticalWorkday(
        resignEmployeeWithMonth,
        filterParams?.year || 0,
        filterParams?.month || 0,
    );

    const statisticalWorkdayByStatus = (status: 'active' | 'resign' | 'all') => {
        if (status === 'active') {
            return statisticalWorkdayActive;
        }
        if (status === 'resign') {
            return statisticalWorkdayResign;
        }
        if (status === 'all') {
            return statisticalWorkday;
        }
        return statisticalWorkday;
    };

    const filterByParams = statisticalWorkdayByStatus(filterParams?.status || 'all').filter(
        (item) => {
            // Filter by search text
            const matchesSearch = filterParams?.search
                ? item.card_number
                      .trim()
                      .toLowerCase()
                      .includes(filterParams.search.trim().toLowerCase()) ||
                  item.fullname
                      .trim()
                      .toLowerCase()
                      .includes(filterParams.search.trim().toLowerCase())
                : true;

            // Filter by unit
            const matchesUnit = filterParams?.unit_id
                ? item.unit.id === filterParams.unit_id
                : true;

            return matchesSearch && matchesUnit;
        },
    );

    return {
        factoryInspectionAttendance: originData,
        resignEmployee,
        statisticalWorkday: filterByParams,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
