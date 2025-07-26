import { RangeDateStatisticalAttendance } from '@/types/response/dailyStatisticalAttendance';
import { WorkPlaceResponse } from '@/types/response/workplace';
import * as XLSX from 'xlsx';
import * as XLSX_Style from 'xlsx-js-style';

// Type definitions

export const ExportHrStatistical = (
    work_place: number,
    statistical: RangeDateStatisticalAttendance[],
    workplaces: WorkPlaceResponse[],
    dates: string[],
) => {
    const wb = XLSX_Style.utils.book_new();

    dates.forEach((string_date) => {
        let data_public_x: any = [];
        let data_weaving_x: any = [];
        let data_deying_x: any = [];
        let data_public: any = [];
        let data_det: any = [];
        let data_nhuom: any = [];
        let data_all: any[] = [];
        let title_3_length = 0;
        let title_4_length = 0;
        let title_5_length = 0;
        let total_day_shift_data = {
            total_person: 0,
            actual_attendance: 0,
            total_take_leave: 0,
            absence_without_leave_num: 0,
        };

        let total_afternoon_shift_data = {
            total_person: 0,
            actual_attendance: 0,
            total_take_leave: 0,
            absence_without_leave_num: 0,
        };
        let total_night_shift_data = {
            total_person: 0,
            actual_attendance: 0,
            total_take_leave: 0,
            absence_without_leave_num: 0,
        };

        let sub_total_department_public = {
            total_person: 0,
            total_staff: 0,
            total_attendance: 0,
        };
        let sub_total_department_weaving = {
            total_person: 0,
            total_staff: 0,
            total_attendance: 0,
        };
        const workplace = workplaces.find((e) => e.id === work_place);

        // Tìm object theo ngày
        const stat = statistical.find((s) => s.date === string_date);
        if (!stat) return;
        const units = Object.values(stat.statistic_data);

        const x_deying = [
            '染整廠 Xưởng nhuộm',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        const x_weaving = [
            '織布廠 Xưởng Dệt',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        const sum = [
            '',
            '',
            '小計',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];

        if (work_place === 2 || work_place === 3) {
            data_public_x = units.filter((unit: any) => unit.unit.category_id === 1);
            data_weaving_x = units.filter((unit: any) => unit.unit.category_id === 3);
            data_deying_x = units.filter((unit: any) => unit.unit.category_id === 4);

            data_public = data_public_x.map((unit: any) => {
                return [
                    '',
                    `${unit.unit?.name_vn ?? ''}`,
                    `${unit.unit?.name_zh ?? ''}`,
                    '',
                    '',
                    '',
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.attendance_employee_num ?? ''}`,
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.night_shift_num ?? ''}`,
                    `${unit?.dayoff_employee_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    `${unit?.night_shift_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    `${unit?.attendance_employee_num ?? ''}`,
                    '',
                ];
            });
            data_det = data_weaving_x.map((unit: any) => {
                return [
                    '',
                    `${unit.unit?.name_vn ?? ''}`,
                    `${unit.unit?.name_zh ?? ''}`,
                    '',
                    '',
                    '',
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.attendance_employee_num ?? ''}`,
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.night_shift_num ?? ''}`,
                    `${unit?.dayoff_employee_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    `${unit?.night_shift_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    `${unit?.attendance_employee_num ?? ''}`,
                    '',
                ];
            });
            data_nhuom = data_deying_x.map((unit: any) => {
                return [
                    '',
                    `${unit.unit?.name_vn ?? ''}`,
                    `${unit.unit?.name_zh ?? ''}`,
                    '',
                    '',
                    '',
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.attendance_employee_num ?? ''}`,
                    `${unit?.unit_employee_num ?? ''}`,
                    `${unit?.night_shift_num ?? ''}`,
                    `${unit?.dayoff_employee_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    `${unit?.night_shift_num ?? ''}`,
                    '',
                    '',
                    '',
                    '',
                    `${unit?.attendance_employee_num ?? ''}`,
                    '',
                ];
            });

            const sum_total = [
                '',
                'TỔNG CỘNG',
                '總計',
                '',
                '',
                '',
                `${total_day_shift_data.total_person}`,
                `${total_day_shift_data.actual_attendance}`,
                `${total_day_shift_data.total_take_leave}`,
                `${total_day_shift_data.absence_without_leave_num}`,
                '', // % có thể tự tính
                '',
                `${total_afternoon_shift_data.total_person}`,
                `${total_afternoon_shift_data.actual_attendance}`,
                `${total_afternoon_shift_data.total_take_leave}`,
                `${total_afternoon_shift_data.absence_without_leave_num}`,
                '',
                '',
                `${total_night_shift_data.total_person}`,
                `${total_night_shift_data.actual_attendance}`,
                `${total_night_shift_data.total_take_leave}`,
                `${total_night_shift_data.absence_without_leave_num}`,
                '',
                '',
                '',
            ];
            data_all = [
                ...data_public,
                sum,
                x_weaving,
                ...data_det,
                sum,
                x_deying,
                ...data_nhuom,
                sum,
                sum_total,
            ];

            title_3_length = 3 + data_public.length + 1 + 1;
            title_4_length = title_3_length + data_det.length + 1 + 1;
            title_5_length = title_4_length + data_nhuom.length + 1 + 1;
        } else if (work_place === 4 || work_place === 5) {
            data_public_x = units.filter((unit: any) => unit.unit.category_id === 1);
            data_weaving_x = units.filter((unit: any) => unit.unit.category_id === 3);

            // Hàm tạo dòng tổng kết cho từng ca
            function createShiftSumRow(
                shift_data_day: any,
                shift_data_afternoon: any,
                shift_data_night: any,
                sub_total_department: any,
                label = '小計',
            ) {
                const percentage_day =
                    (shift_data_day.actual_attendance / shift_data_day.total_person) * 100 || 0;
                const percentage_afternoon =
                    (shift_data_afternoon.actual_attendance / shift_data_afternoon.total_person) *
                        100 || 0;
                const percentage_night =
                    (shift_data_night.actual_attendance / shift_data_night.total_person) * 100 || 0;
                const total_attendance =
                    shift_data_day.actual_attendance +
                    shift_data_afternoon.actual_attendance +
                    shift_data_night.actual_attendance;
                return [
                    '',
                    '',
                    label,
                    `${sub_total_department.total_person}`,
                    `${sub_total_department.total_staff}`,
                    `${sub_total_department.total_attendance}`,
                    `${shift_data_day.total_person}`,
                    `${shift_data_day.actual_attendance}`,
                    `${shift_data_day.total_take_leave}`,
                    `${shift_data_day.absence_without_leave_num}`,
                    `${percentage_day.toFixed(2)}`,
                    '',
                    `${shift_data_afternoon.total_person}`,
                    `${shift_data_afternoon.actual_attendance}`,
                    `${shift_data_afternoon.total_take_leave}`,
                    `${shift_data_afternoon.absence_without_leave_num}`,
                    `${percentage_afternoon.toFixed(2)}`,
                    '',
                    `${shift_data_night.total_person}`,
                    `${shift_data_night.actual_attendance}`,
                    `${shift_data_night.total_take_leave}`,
                    `${shift_data_night.absence_without_leave_num}`,
                    `${percentage_night.toFixed(2)}`,
                    '',
                    `${total_attendance}`,
                    '',
                ];
            }

            // Tổng riêng cho từng nhóm
            let total_public_day = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };
            let total_public_afternoon = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };
            let total_public_night = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };
            let total_weaving_day = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };
            let total_weaving_afternoon = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };
            let total_weaving_night = {
                total_person: 0,
                actual_attendance: 0,
                total_take_leave: 0,
                absence_without_leave_num: 0,
            };

            data_public = data_public_x.map((unit: any) => {
                const day_shift_data = unit.day_shift;
                const afternoon_shift_data = unit.afternoon_shift;
                const night_shift_data = unit.night_shift;

                // Cộng dồn tổng riêng cho public
                total_public_day.total_person += day_shift_data.total_employee ?? 0;
                total_public_day.actual_attendance += day_shift_data.actual_attendance ?? 0;
                total_public_day.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_public_day.absence_without_leave_num +=
                    day_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng riêng cho public
                total_public_afternoon.total_person += afternoon_shift_data.total_employee ?? 0;
                total_public_afternoon.actual_attendance +=
                    afternoon_shift_data.actual_attendance ?? 0;
                total_public_afternoon.total_take_leave +=
                    afternoon_shift_data.total_take_leave ?? 0;
                total_public_afternoon.absence_without_leave_num +=
                    afternoon_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng riêng cho public
                total_public_night.total_person += night_shift_data.total_employee ?? 0;
                total_public_night.actual_attendance += night_shift_data.actual_attendance ?? 0;
                total_public_night.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_public_night.absence_without_leave_num +=
                    night_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng chung
                total_day_shift_data.total_person += day_shift_data.total_employee ?? 0;
                total_day_shift_data.actual_attendance += day_shift_data.actual_attendance ?? 0;
                total_day_shift_data.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_day_shift_data.absence_without_leave_num +=
                    day_shift_data.absence_without_leave_num ?? 0;

                total_afternoon_shift_data.total_person += afternoon_shift_data.total_employee ?? 0;
                total_afternoon_shift_data.actual_attendance +=
                    afternoon_shift_data.actual_attendance ?? 0;
                total_afternoon_shift_data.total_take_leave +=
                    afternoon_shift_data.total_take_leave ?? 0;
                total_afternoon_shift_data.absence_without_leave_num +=
                    afternoon_shift_data.absence_without_leave_num ?? 0;

                total_night_shift_data.total_person += night_shift_data.total_employee ?? 0;
                total_night_shift_data.actual_attendance += night_shift_data.actual_attendance ?? 0;
                total_night_shift_data.total_take_leave += night_shift_data.total_take_leave ?? 0;
                total_night_shift_data.absence_without_leave_num +=
                    night_shift_data.absence_without_leave_num ?? 0;

                sub_total_department_public.total_person += unit.unit_employee_num ?? 0;
                sub_total_department_public.total_staff += unit.unit_employee_num ?? 0;
                sub_total_department_public.total_attendance += unit.attendance_employee_num ?? 0;

                return [
                    '',
                    `${unit.unit?.name_vn ?? ''}`,
                    `${unit.unit?.name_zh ?? ''}`,
                    `${unit.unit_employee_num ?? ''}`,
                    `${unit.unit_employee_num ?? ''}`,
                    `${unit?.attendance_employee_num ?? ''}`,
                    `${day_shift_data.total_employee ?? ''}`,
                    `${day_shift_data.actual_attendance ?? ''}`,
                    `${day_shift_data.total_take_leave ?? ''}`,
                    `${day_shift_data.absence_without_leave_num ?? ''}`,
                    `${day_shift_data.percentage ?? ''}`,
                    '',
                    `${afternoon_shift_data.total_employee ?? ''}`,
                    `${afternoon_shift_data.actual_attendance ?? ''}`,
                    `${afternoon_shift_data.total_take_leave ?? ''}`,
                    `${afternoon_shift_data.absence_without_leave_num ?? ''}`,
                    `${afternoon_shift_data.percentage ?? ''}`,
                    '',
                    `${night_shift_data.total_employee ?? ''}`,
                    `${night_shift_data.actual_attendance ?? ''}`,
                    `${night_shift_data.total_take_leave ?? ''}`,
                    `${night_shift_data.absence_without_leave_num ?? ''}`,
                    `${night_shift_data.percentage ?? ''}`,
                    '',
                    `${unit?.attendance_employee_num ?? ''}`,
                    '',
                ];
            });
            data_det = data_weaving_x.map((unit: any) => {
                const day_shift_data = unit.day_shift;
                const afternoon_shift_data = unit.afternoon_shift;
                const night_shift_data = unit.night_shift;

                // Cộng dồn tổng riêng cho weaving
                total_weaving_day.total_person += day_shift_data.total_employee ?? 0;
                total_weaving_day.actual_attendance += day_shift_data.actual_attendance ?? 0;
                total_weaving_day.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_weaving_day.absence_without_leave_num +=
                    day_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng riêng cho weaving

                total_weaving_afternoon.total_person += afternoon_shift_data.total_employee ?? 0;
                total_weaving_afternoon.actual_attendance +=
                    afternoon_shift_data.actual_attendance ?? 0;
                total_weaving_afternoon.total_take_leave +=
                    afternoon_shift_data.total_take_leave ?? 0;
                total_weaving_afternoon.absence_without_leave_num +=
                    afternoon_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng riêng cho weaving

                total_weaving_night.total_person += night_shift_data.total_employee ?? 0;
                total_weaving_night.actual_attendance += night_shift_data.actual_attendance ?? 0;
                total_weaving_night.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_weaving_night.absence_without_leave_num +=
                    night_shift_data.absence_without_leave_num ?? 0;

                // Cộng dồn tổng chung
                total_day_shift_data.total_person += day_shift_data.total_employee ?? 0;
                total_day_shift_data.actual_attendance += day_shift_data.actual_attendance ?? 0;
                total_day_shift_data.total_take_leave += day_shift_data.total_take_leave ?? 0;
                total_day_shift_data.absence_without_leave_num +=
                    day_shift_data.absence_without_leave_num ?? 0;

                total_afternoon_shift_data.total_person += afternoon_shift_data.total_employee ?? 0;
                total_afternoon_shift_data.actual_attendance +=
                    afternoon_shift_data.actual_attendance ?? 0;
                total_afternoon_shift_data.total_take_leave +=
                    afternoon_shift_data.total_take_leave ?? 0;
                total_afternoon_shift_data.absence_without_leave_num +=
                    afternoon_shift_data.absence_without_leave_num ?? 0;

                total_night_shift_data.total_person += night_shift_data.total_employee ?? 0;
                total_night_shift_data.actual_attendance += night_shift_data.actual_attendance ?? 0;
                total_night_shift_data.total_take_leave += night_shift_data.total_take_leave ?? 0;
                total_night_shift_data.absence_without_leave_num +=
                    night_shift_data.absence_without_leave_num ?? 0;

                sub_total_department_weaving.total_person += unit.unit_employee_num ?? 0;
                sub_total_department_weaving.total_staff += unit.unit_employee_num ?? 0;
                sub_total_department_weaving.total_attendance += unit.attendance_employee_num ?? 0;
                return [
                    '',
                    `${unit.unit?.name_vn ?? ''}`,
                    `${unit.unit?.name_zh ?? ''}`,
                    `${unit.unit_employee_num ?? ''}`,
                    `${unit.unit_employee_num ?? ''}`,
                    `${unit?.attendance_employee_num ?? ''}`,
                    `${day_shift_data.total_employee ?? ''}`,
                    `${day_shift_data.actual_attendance ?? ''}`,
                    `${day_shift_data.total_take_leave ?? ''}`,
                    `${day_shift_data.absence_without_leave_num ?? ''}`,
                    `${day_shift_data.percentage ?? ''}`,
                    '',
                    `${afternoon_shift_data.total_employee ?? ''}`,
                    `${afternoon_shift_data.actual_attendance ?? ''}`,
                    `${afternoon_shift_data.total_take_leave ?? ''}`,
                    `${afternoon_shift_data.absence_without_leave_num ?? ''}`,
                    `${afternoon_shift_data.percentage ?? ''}`,
                    '',
                    `${night_shift_data.total_employee ?? ''}`,
                    `${night_shift_data.actual_attendance ?? ''}`,
                    `${night_shift_data.total_take_leave ?? ''}`,
                    `${night_shift_data.absence_without_leave_num ?? ''}`,
                    `${night_shift_data.percentage ?? ''}`,
                    '',
                    `${unit?.attendance_employee_num ?? ''}`,
                    '',
                ];
            });

            const percentage_day_shift =
                total_day_shift_data.total_person > 0
                    ? (total_day_shift_data.actual_attendance / total_day_shift_data.total_person) *
                      100
                    : 0;
            const percentage_afternoon_shift =
                total_afternoon_shift_data.total_person > 0
                    ? (total_afternoon_shift_data.actual_attendance /
                          total_afternoon_shift_data.total_person) *
                      100
                    : 0;
            const percentage_night_shift =
                total_night_shift_data.total_person > 0
                    ? (total_night_shift_data.actual_attendance /
                          total_night_shift_data.total_person) *
                      100
                    : 0;

            // Dòng tổng riêng cho từng nhóm
            const sum_public = createShiftSumRow(
                total_public_day,
                total_public_afternoon,
                total_public_night,
                sub_total_department_public,
                '小計 公共',
            );
            const sum_weaving = createShiftSumRow(
                total_weaving_day,
                total_weaving_afternoon,
                total_weaving_night,
                sub_total_department_weaving,
                '小計 DỆT',
            );

            const total_person =
                sub_total_department_public.total_person +
                sub_total_department_weaving.total_person;
            const total_staff =
                sub_total_department_public.total_staff + sub_total_department_weaving.total_staff;
            const total_attendance_all =
                sub_total_department_public.total_attendance +
                sub_total_department_weaving.total_attendance;

            const total_attendance =
                total_day_shift_data.actual_attendance +
                total_afternoon_shift_data.actual_attendance +
                total_night_shift_data.actual_attendance;
            // Dòng tổng kết lớn (sum_total)
            const sum_total = [
                '',
                'TỔNG CỘNG',
                '總計',
                `${total_person}`,
                `${total_staff}`,
                `${total_attendance_all}`,
                `${total_day_shift_data.total_person}`,
                `${total_day_shift_data.actual_attendance}`,
                `${total_day_shift_data.total_take_leave}`,
                `${total_day_shift_data.absence_without_leave_num}`,
                `${percentage_day_shift.toFixed(2)}`,
                '',
                `${total_afternoon_shift_data.total_person}`,
                `${total_afternoon_shift_data.actual_attendance}`,
                `${total_afternoon_shift_data.total_take_leave}`,
                `${total_afternoon_shift_data.absence_without_leave_num}`,
                `${percentage_afternoon_shift.toFixed(2)}`,
                '',
                `${total_night_shift_data.total_person}`,
                `${total_night_shift_data.actual_attendance}`,
                `${total_night_shift_data.total_take_leave}`,
                `${total_night_shift_data.absence_without_leave_num}`,
                `${percentage_night_shift.toFixed(2)}`,
                '',
                `${total_attendance}`,
                '',
            ];
            data_all = [...data_public, sum_public, x_weaving, ...data_det, sum_weaving, sum_total];

            title_3_length = 3 + data_public.length + 1 + 1;
            title_4_length = title_3_length + data_det.length + 1 + 1;
            title_5_length = title_4_length;
        }

        //25
        const ws_data = [
            // title 1
            [
                '',
                '',
                '',
                'BÁO CÁO NHÂN SỰ HÀNG NGÀY',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            // category
            [
                '',
                'Đơn vị',
                '單位',
                'Trực thuộc 屬性',
                'Biên chế 編制',
                'Tổng số người thực tế 實際總人數',
                'Ca ngày 日班 ',
                '',
                '',
                '',
                'TỈ LỆ',
                'CNV X2 (二廠)',
                'Ca Chiều 中班 ',
                '',
                '',
                '',
                'TỈ LỆ',
                'CNV X2 (二廠)',
                'Ca đêm 夜班 ',
                '',
                '',
                '',
                'TỈ LỆ',
                'CNV X2 (二廠)',
                'Tổng số  CNV Đi Làm總上班人數',
                'T.SẢN  產婦',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                'Tổng số người總人數',
                'Thực đến實到',
                'Xin nghỉ 請假 ',
                'Không phép曠工 ',
                '實際總人數比上班的百分比',
                '',
                'Tổng số người總人數',
                'Thực đến實到',
                'Xin nghỉ 請假 ',
                'Không phép曠工 ',
                '實際總人數比上班的百分比',
                '',
                'Tổng số người總人數',
                'Thực đến實到',
                'Xin nghỉ 請假 ',
                'Không phép曠工 ',
                '實際總人數比上班的百分比',
                '',
                '',
                '',
            ],

            // title 2
            [
                '公共單位 BP Công cộng',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            ...data_all,
            [
                'Nghỉ thai sản',
                '',
                '休息',
                '含產假休息',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'X2 về X1 phụ 二廠支援',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'Đi: x2去二廠支援',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                'Mang thai, nuôi con nhỏ làm 7 tiếng',
                '',
                '',
                '含懷孕上7小時',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'Còn: X1 在一廠上班',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
        ];

        const ws = XLSX_Style.utils.aoa_to_sheet(ws_data);

        // Gộp các ô (theo ảnh)
        // khi gọp chỉ có thể ghi vào ô đầu tiên các ô còn lại sẽ bị trống
        ws['!merges'] = [
            // tiêu đề
            { s: { r: 0, c: 0 }, e: { r: 0, c: 25 } },

            // tiều đề 2
            { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },
            { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } },
            { s: { r: 1, c: 2 }, e: { r: 2, c: 2 } },
            { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } },
            { s: { r: 1, c: 4 }, e: { r: 2, c: 4 } },
            { s: { r: 1, c: 5 }, e: { r: 2, c: 5 } },
            { s: { r: 1, c: 6 }, e: { r: 1, c: 9 } },
            { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } },
            { s: { r: 1, c: 12 }, e: { r: 1, c: 15 } },
            { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
            { s: { r: 1, c: 18 }, e: { r: 1, c: 21 } },
            { s: { r: 1, c: 23 }, e: { r: 2, c: 23 } },
            { s: { r: 1, c: 24 }, e: { r: 2, c: 24 } },
            { s: { r: 1, c: 25 }, e: { r: 2, c: 25 } },

            // tiêu đề 3
            { s: { r: 3, c: 0 }, e: { r: 3, c: 25 } },

            // tiêu đề 4
            {
                s: { r: title_3_length, c: 0 },
                e: { r: title_3_length, c: 25 },
            },

            //tiêu đề 5
            // if(title_5_length > title_4_length ) {
            //   s: { r: title_4_length, c: 0 },
            //   e: { r: title_4_length, c: 25 },
            // },

            // thai sản
            {
                s: { r: title_5_length + 1, c: 0 },
                e: { r: title_5_length + 2, c: 1 },
            },
            {
                s: { r: title_5_length + 3, c: 0 },
                e: { r: title_5_length + 3, c: 1 },
            },
            {
                s: { r: title_5_length + 1, c: 2 },
                e: { r: title_5_length + 2, c: 2 },
            },
            {
                s: { r: title_5_length + 1, c: 3 },
                e: { r: title_5_length + 2, c: 3 },
            },

            {
                s: { r: title_5_length + 1, c: 19 },
                e: { r: title_5_length + 1, c: 23 },
            },
            {
                s: { r: title_5_length + 2, c: 19 },
                e: { r: title_5_length + 2, c: 23 },
            },

            // mang thai
            {
                s: { r: title_5_length + 3, c: 19 },
                e: { r: title_5_length + 3, c: 23 },
            },
        ];

        if (title_5_length > title_4_length) {
            ws['!merges'].push({
                s: { r: title_4_length, c: 0 },
                e: { r: title_4_length, c: 25 },
            });
        }
        // Đặt nội dung vào ô đầu tiên của vùng gộp

        ws['A1'].v =
            `BÁO CÁO NHÂN SỰ HÀNG NGÀY每日出勤表  (${workplace?.name_zh ?? ''}) - ${string_date}`;

        // border
        const range = {
            s: { r: 0, c: 0 },
            e: { r: title_5_length + 5 + 1, c: 25 },
        };

        // Lặp qua từng ô trong phạm vi
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: R, c: C });

                // Kiểm tra nếu ô đã tồn tại, nếu không, tạo mới ô
                if (!ws[cell_address]) ws[cell_address] = { t: 's', v: '' };

                // Thêm border cho ô
                ws[cell_address].s = {
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } },
                    },
                    font: {
                        sz: 10,
                        bold: true,
                        color: { rgb: '000000' },
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                };
            }
        }

        // kích thước ô
        // Thiết lập chiều rộng cho cột
        // Thiết lập chiều rộng cho cột B (Cột có chứa ô B2)
        ws['!cols'] = [
            { wpx: 40 }, // Cột A không thay đổi
            { wpx: 150 }, // Cột B có độ rộng 150 pixel
        ];

        // Thiết lập chiều cao cho hàng 2
        ws['!rows'] = [{ hpx: 40 }, { hpx: 50 }, { hpx: 50 }];

        // Định dạng một số ô (ví dụ)
        const color_blue = {
            font: {
                bold: true,
                color: { rgb: '0000FF' },
            },
        };

        const color_red = {
            font: {
                bold: true,
                color: { rgb: 'FF0000' },
            },
        };

        // Apply the style to a range of cells
        ws['A1'].s = {
            font: {
                sz: 16,
                bold: true,
                color: { rgb: '000000' },
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
        };

        ['G2', 'K2', 'M2', 'Q2', 'S2', 'W2'].forEach((e) => {
            ws[e].s = color_blue;
        });

        ['L2', 'R2', 'X2'].forEach((e) => {
            ws[e].s = color_red;
        });

        ws['Z2'].s = {
            font: {
                bold: true,
                color: { rgb: '00FFFF' },
            },
        };

        ws[XLSX.utils.encode_cell({ r: 4, c: 0 })].s = {
            font: {
                sz: 16,
                bold: true,
                color: { rgb: '000000' },
            },
        };

        // các ô title định dạng
        [
            XLSX.utils.encode_cell({ r: 3, c: 0 }),
            XLSX.utils.encode_cell({ r: title_3_length, c: 0 }),
            XLSX.utils.encode_cell({ r: title_4_length, c: 0 }),
        ].forEach(
            (e) =>
                (ws[e].s = {
                    font: {
                        sz: 16,
                        bold: true,
                        color: { rgb: '000000' },
                    },
                    alignment: {
                        horizontal: 'left',
                        vertical: 'left',
                    },
                }),
        );

        XLSX_Style.utils.book_append_sheet(
            wb,
            ws,
            `${workplace?.name_vn ?? ''}${workplace?.name_zh ?? ''} - ${string_date}`,
        );
    });

    // Xuất file Excel
    XLSX_Style.writeFile(wb, `bao_cao_nhan_su.xlsx`);
};
