import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { urls } from '@/utils/constants/common/urls';
import { BaseResponse } from '@/types/response/baseResponse';
import { AttendanceV2Type } from '@/types/response/attendance';
import { checkSunday } from '@/utils/functions/checkSunday';
import { calculateShiftHour } from '@/utils/functions/calculateShiftHour';
import { calculateStatisticalWorkday } from '@/utils/functions/calculateStatisticalWorkday';

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
    year?: number;
    month?: number;
    status?: 'active' | 'resign' | 'all';
}
export const useAttendanceV2 = (params: params, filterParams?: filterParams) => {
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
        if (!filterParams?.search) return true;

        const searchTerm = filterParams?.search.toLowerCase().trim();
        const fullnameMatch = item.fullname.toLowerCase().includes(searchTerm);
        const cardNumberMatch = item.card_number.toLowerCase().includes(searchTerm);
        const shiftTagMatch = item?.details[0]?.shift?.tag?.toLowerCase().includes(searchTerm);

        // Sử dụng OR (||) để tìm kiếm theo bất kỳ trường nào
        return fullnameMatch || cardNumberMatch || shiftTagMatch;
    };

    const matchesUnit = (item: AttendanceV2WithKey): boolean => {
        return filterParams?.unit_id ? item.unit.id === filterParams.unit_id : true;
    };

    const matchesAbnormalStatus = (item: AttendanceV2WithKey): boolean => {
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

    const isActiveEmployee = (item: AttendanceV2WithKey): boolean => {
        return item.active;
    };

    const filterActiveEmployee = (item: AttendanceV2WithKey) => {
        return filterParams?.is_abnormal
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

        employees.forEach((employee) => {
            employee.details.forEach((detail) => {
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
    const resignEmployeeWithMonth = resignEmployee.filter((item) => {
        if (item.resign_date) {
            const date = new Date(item.resign_date); // Tự parse từ chuỗi YYYY-MM-DD
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth: 0–11
            return month === filterParams?.month?.toString().padStart(2, '0');
        }
        return false;
    });

    const statisticalWorkday = calculateStatisticalWorkday(
        transformedData,
        filterParams?.year || 0,
        filterParams?.month || 0,
    );
    const statisticalWorkdayActive = calculateStatisticalWorkday(
        activeEmployee,
        filterParams?.year || 0,
        filterParams?.month || 0,
    );

    const statisticalWorkdayResign = calculateStatisticalWorkday(
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
        attendance: activeEmployee,
        resignEmployee,
        statisticalWorkday: filterByParams,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};
