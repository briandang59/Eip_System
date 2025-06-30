'use client';
import { useTrackingLog } from '@/apis/useSwr/tracking-log';
import {
    Card,
    DatePicker,
    Spin,
    Tag,
    Typography,
    Button,
    message,
    Pagination,
    Input,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import {
    UserCircle2,
    Globe,
    Clock,
    AlertCircle,
    Copy,
    Check,
    ArrowUpDown,
    RefreshCcw,
} from 'lucide-react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import debounce from 'lodash/debounce';
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

function TrackingLogPage() {
    const { t } = useTranslationCustom();
    const [dateRange, setDateRange] = useState({
        start_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [sort, setSort] = useState<string>('asc');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [searchValue, setSearchValue] = useState<string>('');
    const [isSearching, setIsSearching] = useState(false);
    const { isError, isLoading, trackingLogs, total, mutate } = useTrackingLog(
        dateRange,
        page,
        pageSize,
        selectedMethod,
        sort,
        searchValue,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchValue(value);
            setIsSearching(false);
        }, 500),
        [],
    );

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setDateRange({
                start_date: dates[0].format('YYYY-MM-DD'),
                end_date: dates[1].format('YYYY-MM-DD'),
            });
        }
    };
    const toggleSort = () => {
        setSort(sort === 'asc' ? 'desc' : 'asc');
    };
    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            GET: 'green',
            POST: 'blue',
            PUT: 'yellow',
            DELETE: 'red',
            PATCH: 'purple',
        };
        return colors[method] || 'default';
    };

    const handleCopy = async (data: any, type: string, id: number) => {
        const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        try {
            await navigator.clipboard.writeText(textToCopy);
            message.success(t.tracking_log.copy_success);

            // Set copied state for this specific button
            setCopiedStates((prev) => ({ ...prev, [`${id}-${type}`]: true }));

            // Reset copied state after animation
            setTimeout(() => {
                setCopiedStates((prev) => ({ ...prev, [`${id}-${type}`]: false }));
            }, 2000);
        } catch (error) {
            message.error(t.tracking_log.copy_failed);
        }
    };

    const methodOptions = [
        { label: 'All', value: '' },
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' },
    ];
    const renderJsonData = (data: any) => {
        if (!data) return null;
        if (typeof data === 'string') {
            try {
                const parsedData = JSON.parse(data);
                return <JsonView data={parsedData} style={defaultStyles} />;
            } catch {
                return <Text className="text-sm">{data}</Text>;
            }
        }
        return <JsonView data={data} style={defaultStyles} />;
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleSearch = (value: string) => {
        setIsSearching(true);
        debouncedSearch(value);
    };

    const handleMethodChange = (value: string) => {
        setSelectedMethod(value);
    };

    const handleRefresh = () => {
        mutate();
    };

    if (isError) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <Title level={4}>{t.tracking_log.error_loading}</Title>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <RangePicker
                        defaultValue={[dayjs(dateRange.start_date), dayjs(dateRange.end_date)]}
                        onChange={handleDateRangeChange}
                        className="w-[400px]"
                    />
                    <div className="w-[200px]">
                        <Input.Search
                            placeholder={t.tracking_log.search_placeholder}
                            allowClear
                            loading={isSearching}
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        options={methodOptions}
                        onChange={handleMethodChange}
                        className="w-[100px]"
                        value={selectedMethod}
                    />
                    <Button onClick={toggleSort} icon={<ArrowUpDown className="w-4 h-4" />}>
                        {sort === 'asc' ? t.tracking_log.ascending : t.tracking_log.descending}
                    </Button>
                    <Button onClick={handleRefresh} icon={<RefreshCcw className="w-4 h-4" />}>
                        {t.tracking_log.refresh}
                    </Button>
                </div>
                <Pagination
                    total={total}
                    pageSize={pageSize}
                    current={page}
                    onChange={handlePageChange}
                    onShowSizeChange={(current, size) => {
                        setPageSize(size);
                    }}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-[calc(100vh-300px)]">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackingLogs?.map((log) => (
                        <Card
                            key={log.id}
                            className="hover:shadow-lg transition-shadow duration-200"
                            title={
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="w-5 h-5" />
                                    <Text strong>
                                        {log.account} - {log.user}
                                    </Text>
                                </div>
                            }
                            extra={<Tag color={getMethodColor(log.method)}>{log.method}</Tag>}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <Globe className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <Text className="text-sm break-all">{log.url}</Text>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <Text className="text-sm">
                                        {dayjs(log.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </Text>
                                </div>

                                <div className="border-t pt-3 mt-3">
                                    <Text className="text-sm block mb-2">{log.description}</Text>
                                    {log.status_code && (
                                        <Tag
                                            color={log.status_code < 400 ? 'success' : 'error'}
                                            className="mt-2"
                                        >
                                            {t.tracking_log.status}: {log.status_code}
                                        </Tag>
                                    )}
                                </div>

                                {log.parameters && (
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <Text type="secondary" className="text-sm">
                                                {t.tracking_log.parameters}:
                                            </Text>
                                            <Button
                                                type="text"
                                                className={
                                                    copiedStates[`${log.id}-Parameters`]
                                                        ? 'text-green-500'
                                                        : ''
                                                }
                                                icon={
                                                    copiedStates[`${log.id}-Parameters`] ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )
                                                }
                                                onClick={() =>
                                                    handleCopy(log.parameters, 'Parameters', log.id)
                                                }
                                                size="small"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            {renderJsonData(log.parameters)}
                                        </div>
                                    </div>
                                )}

                                {log.response_data && (
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <Text type="secondary" className="text-sm">
                                                {t.tracking_log.response_data}:
                                            </Text>
                                            <Button
                                                type="text"
                                                className={
                                                    copiedStates[`${log.id}-Response Data`]
                                                        ? 'text-green-500'
                                                        : ''
                                                }
                                                icon={
                                                    copiedStates[`${log.id}-Response Data`] ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )
                                                }
                                                onClick={() =>
                                                    handleCopy(
                                                        log.response_data,
                                                        'Response Data',
                                                        log.id,
                                                    )
                                                }
                                                size="small"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            {renderJsonData(log.response_data)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TrackingLogPage;
