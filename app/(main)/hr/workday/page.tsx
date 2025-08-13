'use client';

import { GenericTable } from '@/components/common/GenericTable';
import { useWorkdayCols } from '@/utils/constants/cols/workdayCols';
import { Button, DatePicker, Input, Select, Switch, Alert, Modal } from 'antd';
import { useWorkPlaces } from '@/apis/useSwr/work-places';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useAttendanceV2 } from '@/apis/useSwr/attendance';
import { getInfomation } from '@/utils/functions/getInfomation';
import ClientOnly from '@/components/common/ClientOnly';
import { AttendanceV2Type } from '@/types/response/attendance';
import { useUnits } from '@/apis/useSwr/units';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { FileExcelOutlined } from '@ant-design/icons';
import { ReloadOutlined } from '@ant-design/icons';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';
import TakeLeaveForm from '@/components/forms/TakeLeaveForm';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { summaryWorkdayRow } from '@/utils/constants/totalRows/workdaySummaryRow';
import { faceScanService } from '@/apis/services/faceScan';
import { toast } from 'sonner';
import FaceScanUI from '@/components/ui/faceScanUI';
import ClockTimeForm from '@/components/forms/ClockTimeForm';
import LogsUI from '@/components/ui/logsUI';
import { useLogs } from '@/apis/useSwr/logs';
import Overtime from '@/components/forms/Overtime';
import { EditedClockTime } from '@/components/ui/editClocktimeUI';
import { useFactoryStore } from '@/stores/useFactoryStore';
import { useTakeLeave } from '@/apis/useSwr/takeLeave';
import { TakeLeaveResponseType } from '@/types/response/takeLeave';
import { routes } from '@/utils/constants/common/routes';

function Workday() {
    const { t, lang } = useTranslationCustom();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [key, setKey] = useState<string>('');
    const [widthModal, setWidthModal] = useState<number>(1000);
    const [selectedCardNumber, setSelectedCardNumber] = useState<string>('');
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceV2Type | null>(null);
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null);
    // Thêm state để lưu record đang edit
    const [selectedTakeLeaveRecord, setSelectedTakeLeaveRecord] = useState<
        TakeLeaveResponseType | undefined
    >(undefined);

    const handleOpenModalByKey = (key: string) => {
        switch (key) {
            case 'take_leave':
                setKey('take_leave');
                setIsOpenModal(true);
                setWidthModal(1000);
                break;
            case 'image_scan_t1':
                setKey('image_scan_t1');
                setIsOpenModal(true);
                setWidthModal(500);
                break;
            case 'image_scan_t2':
                setKey('image_scan_t2');
                setIsOpenModal(true);
                setWidthModal(500);
                break;
            case 'clock_edit':
                setKey('clock_edit');
                setIsOpenModal(true);
                setWidthModal(500);
                break;
            case 'logs':
                setKey('logs');
                setIsOpenModal(true);
                setWidthModal(700);
                break;
            case 'overtime':
                setKey('overtime');
                setIsOpenModal(true);
                setWidthModal(700);
                break;
            case 'edited_clock_time':
                setKey('edited_clock_time');
                setIsOpenModal(true);
                setWidthModal(700);
                break;
            case 'shift_scheduling':
                setKey('shift_scheduling');
                setIsOpenModal(true);
                setWidthModal(1400);
                break;
            default:
                break;
        }
    };
    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSelectedTakeLeaveRecord(undefined);
    };
    const handleSelectedCardNumber = (uuid: string) => {
        setSelectedCardNumber(uuid);
    };
    const handleSelectedAttendance = (atd: AttendanceV2Type) => {
        setSelectedAttendance(atd);
    };
    const workdayCols = useWorkdayCols({
        handleOpenModalByKey,
        handleSelectedCardNumber,
        handleSelectedAttendance,
    });

    const [isAbnormal, setIsAbnormal] = useState<boolean>(false);
    const { filterWorkPlaces, isLoading: isLoadingWorkPlaces } = useWorkPlaces();
    const myInfo = getInfomation();
    const { selectedFactoryId, setSelectedFactoryId } = useFactoryStore();
    const selectedWorkPlace = selectedFactoryId || myInfo?.work_place_id || 0;
    const {
        logsByDate,
        isLoading: isLoadingLogs,
        isError: isErrorLogs,
    } = useLogs({
        date:
            (selectedAttendance && selectedAttendance?.details[0]?.date) ||
            dayjs().format('YYYY-MM-DD'),
        scope_days: 1,
        work_place_id: selectedWorkPlace && selectedWorkPlace,
        card_number: selectedAttendance?.card_number,
    });
    useEffect(() => {
        if (selectedAttendance !== null && (key === 'image_scan_t2' || key === 'image_scan_t1')) {
            const facePhoto =
                key === 'image_scan_t1'
                    ? selectedAttendance?.details?.[0]?.workday?.T1?.face_photo
                    : selectedAttendance?.details?.[0]?.workday?.T2?.face_photo;
            const work_place_id =
                key === 'image_scan_t1'
                    ? selectedAttendance?.details?.[0]?.attendance?.[0]?.T1?.work_place_id
                    : selectedAttendance?.details?.[0]?.attendance?.[0]?.T2?.work_place_id;

            const payload = {
                uri: facePhoto,
                place_id: work_place_id,
            };

            faceScanService
                .get(payload)
                .then((res) => {
                    setImageBase64Url(res);
                })
                .catch((err) => {
                    toast.error(`${err}`);
                });
        }
    }, [selectedAttendance, selectedWorkPlace, key]);

    const { units, isLoading: isLoadingUnits } = useUnits({
        place_id: selectedWorkPlace.toString() || undefined,
    });

    const [dateRange, setDateRange] = useState<{ start: Dayjs; end: Dayjs }>({
        start: dayjs(),
        end: dayjs(),
    });

    // Thêm mutate function cho take leave
    const { mutate: mutateTakeLeave } = useTakeLeave({
        work_place_id: selectedWorkPlace || 0,
        start: dateRange.start.format('YYYY-MM-DD'),
        end: dateRange.end.format('YYYY-MM-DD'),
    });

    // Thêm useEffect để mutate take leave khi dateRange thay đổi
    useEffect(() => {
        if (mutateTakeLeave) {
            mutateTakeLeave();
        }
    }, [dateRange, selectedWorkPlace, mutateTakeLeave]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchText(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        attendance,
        isError,
        isLoading: isLoadingAttendance,
        mutate,
    } = useAttendanceV2(
        {
            start: dateRange.start.format('YYYY-MM-DD') || '',
            end: dateRange.end.format('YYYY-MM-DD') || '',
            work_place_id: selectedWorkPlace || undefined,
        },
        {
            search: searchText,
            unit_id: selectedUnit,
            is_abnormal: isAbnormal,
        },
    );

    if (isError) {
        console.error('Attendance API Error:', isError);
    }

    const data: AttendanceV2Type[] = attendance || [];

    const onChangeDateRange = (value: [Dayjs | null, Dayjs | null] | null) => {
        if (value) {
            setDateRange({
                start: value[0]!,
                end: value[1]!,
            });
        }
    };

    const handleRefresh = () => {
        mutate();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (value: string) => {
        setSearchText(value);
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setSearchText('');
    };

    const { exportWithoutSummary } = useExportToExcel(workdayCols, 'Workday', 'Workday Data');

    const handleExportExcel = () => {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        const startDate = dateRange.start.format('YYYY-MM-DD');
        const endDate = dateRange.end.format('YYYY-MM-DD');
        const workplaceName =
            filterWorkPlaces?.find((wp) => wp.id === selectedWorkPlace)?.name_en || 'AllWorkplaces';
        const abnormalText = isAbnormal ? 'Abnormal' : 'Normal';
        const filename = `Workday_${startDate}_to_${endDate}_${workplaceName}_${abnormalText}`;

        exportWithoutSummary(data, filename);
    };
    const renderForm = () => {
        switch (key) {
            case 'take_leave':
                return (
                    <TakeLeaveForm
                        card_number={selectedCardNumber}
                        isOpen={isOpenModal}
                        close={handleCloseModal}
                        mutate={mutateTakeLeave}
                        takeLeaveRecord={selectedTakeLeaveRecord}
                    />
                );
            case 'image_scan_t1':
                return (
                    <div>
                        {selectedAttendance && (
                            <FaceScanUI
                                imageBase64Url={imageBase64Url}
                                full_name={selectedAttendance?.fullname}
                                card_number={selectedAttendance?.card_number}
                                t1={selectedAttendance?.details[0]?.attendance?.[0]?.T1?.time}
                            />
                        )}
                    </div>
                );
            case 'image_scan_t2':
                return (
                    <div>
                        {selectedAttendance && (
                            <FaceScanUI
                                imageBase64Url={imageBase64Url}
                                full_name={selectedAttendance?.fullname}
                                card_number={selectedAttendance?.card_number}
                                t2={selectedAttendance?.details[0]?.attendance?.[0]?.T2?.time}
                            />
                        )}
                    </div>
                );
            case 'clock_edit':
                return (
                    <ClockTimeForm
                        attendance={selectedAttendance}
                        mutate={mutate}
                        close={handleCloseModal}
                    />
                );
            case 'logs':
                return (
                    <>
                        {selectedAttendance && selectedWorkPlace && (
                            <LogsUI
                                card_number={selectedAttendance?.card_number}
                                full_name={selectedAttendance?.fullname}
                                logsByDate={logsByDate}
                                work_place={selectedWorkPlace}
                                isLoading={isLoadingLogs}
                                isError={isErrorLogs}
                            />
                        )}
                    </>
                );
            case 'overtime':
                return (
                    <div>
                        {selectedAttendance && (
                            <Overtime
                                attendance={selectedAttendance}
                                mutate={mutate}
                                close={handleCloseModal}
                            />
                        )}
                    </div>
                );
            case 'edited_clock_time':
                return (
                    <>
                        {selectedAttendance && (
                            <EditedClockTime selectedAttendance={selectedAttendance} />
                        )}
                    </>
                );
            case 'shift_scheduling':
                return (
                    <div className="h-[500px]">
                        {selectedAttendance && (
                            <iframe
                                src={`http://localhost:8000/${routes.hr.shiftScheduling}?card_number=${selectedAttendance?.card_number}&unit_id=${selectedAttendance.unit.id}`}
                                width="100%"
                                height="100%"
                            />
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ClientOnly>
            <div className="min-h-screen">
                <div className="flex flex-wrap items-end mb-4 gap-2">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t.workday.work_place}</span>
                        <Select
                            options={filterWorkPlaces?.map((item) => ({
                                label: `${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                                value: item.id,
                            }))}
                            style={{ width: '150px' }}
                            value={selectedWorkPlace}
                            onChange={setSelectedFactoryId}
                            loading={isLoadingWorkPlaces}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t.workday.unit}</span>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select Unit"
                            allowClear
                            value={selectedUnit}
                            onChange={setSelectedUnit}
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '')
                                    .toLowerCase()
                                    .localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={units?.map((item) => ({
                                label: `${item.code} - ${getLocalizedName(item.name_en, item.name_zh, item.name_vn, lang)}`,
                                value: item.id,
                            }))}
                            loading={isLoadingUnits}
                        />
                    </div>

                    <Input.Search
                        placeholder="Search employee name"
                        style={{ width: '200px' }}
                        value={searchInput}
                        onChange={handleSearchChange}
                        onSearch={handleSearchSubmit}
                        onClear={handleSearchClear}
                        allowClear
                    />
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t.workday.date}</span>
                        <DatePicker.RangePicker
                            style={{ width: '250px' }}
                            value={[dateRange.start, dateRange.end]}
                            onChange={onChangeDateRange}
                            allowClear={false}
                        />
                    </div>
                    <Button
                        icon={<FileExcelOutlined className="!text-green-600" />}
                        onClick={handleExportExcel}
                        disabled={!data || data.length === 0}
                    >
                        {t.workday.export}
                    </Button>
                    <Button
                        icon={<ReloadOutlined className="!text-orange-500" />}
                        onClick={handleRefresh}
                        loading={isLoadingAttendance}
                    >
                        {t.workday.refresh}
                    </Button>
                    <Switch
                        checkedChildren={t.workday.normal}
                        unCheckedChildren={t.workday.abnormal}
                        checked={isAbnormal}
                        onChange={setIsAbnormal}
                    />
                </div>

                {/* Show error message if API request failed */}
                {isError && (
                    <Alert
                        message={t.workday.error_loading}
                        description={
                            <div>
                                <div style={{ marginBottom: 8 }}>
                                    {isError?.message || t.workday.error_loading}
                                </div>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={handleRefresh}
                                    loading={isLoadingAttendance}
                                >
                                    {t.workday.try_again}
                                </Button>
                            </div>
                        }
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Show table with data or fallback data */}
                <GenericTable<AttendanceV2Type>
                    columns={workdayCols}
                    dataSource={data}
                    rowKey="stt"
                    isLoading={isLoadingAttendance}
                    summary={() => summaryWorkdayRow(attendance, t)}
                    pagination={{
                        defaultPageSize: 30,
                        pageSizeOptions: ['30', '50'],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        size: 'default',
                    }}
                />
            </div>
            <Modal
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                footer={null}
                width={widthModal}
                centered
            >
                {renderForm()}
            </Modal>
        </ClientOnly>
    );
}

export default Workday;
