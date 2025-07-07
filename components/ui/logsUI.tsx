import { Badge, Button, Collapse, CollapseProps, Modal, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { DateLogMap, LogEntry } from '@/types/response/log';
import FaceScanUI from './faceScanUI';
import { faceScanService } from '@/apis/services/faceScan';
import { toast } from 'sonner';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

interface LogsUIProps {
    card_number: string;
    full_name: string;
    logsByDate?: DateLogMap;
    work_place: number;
}

export default function LogsUI({
    card_number,
    full_name,
    logsByDate = {},
    work_place,
}: LogsUIProps) {
    const { t } = useTranslationCustom();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<LogEntry | null>(null);
    const [imageBase64Url, setImageBase64Url] = useState('');

    const items: CollapseProps['items'] = useMemo(
        () =>
            Object.entries(logsByDate)
                .sort(([a], [b]) => (dayjs(b).isAfter(a) ? 1 : -1))
                .map(([date, entries]) => ({
                    key: date,
                    label: (
                        <Space>
                            <ClockCircleOutlined />
                            {dayjs(date).format('DD/MM/YYYY')}
                            <Badge
                                count={entries.length}
                                style={{ backgroundColor: '#52c41a' }}
                                offset={[4, -2]}
                            />
                        </Space>
                    ),
                    children: (
                        <ul className="space-y-2">
                            {entries.map((log, idx) => (
                                <li
                                    key={idx}
                                    className="grid grid-cols-[90px_1fr] items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
                                >
                                    <span className="text-purple-700 font-medium">
                                        {log.happenTime}
                                    </span>
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            setSelectedRecord(log);
                                            setModalOpen(true);
                                        }}
                                    >
                                        {t.logs.view}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ),
                    style: dayjs(date).isSame(dayjs(), 'day')
                        ? { background: '#f6ffed' }
                        : undefined,
                })),
        [logsByDate, t.logs.view],
    );
    useEffect(() => {
        if (!selectedRecord) return;
        faceScanService
            .get({ uri: selectedRecord.picUri, place_id: work_place })
            .then(setImageBase64Url)
            .catch((err) => toast.error(String(err)));
    }, [selectedRecord, work_place]);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-green-600 mb-2">
                {card_number} – {full_name}
            </h2>

            {items.length ? (
                <Collapse
                    bordered={false}
                    items={items}
                    defaultActiveKey={[dayjs().format('YYYY-MM-DD')]}
                />
            ) : (
                <p className="italic text-gray-500">{t.logs.no_logs}</p>
            )}

            {selectedRecord && (
                <Modal open={isModalOpen} footer={null} onCancel={() => setModalOpen(false)}>
                    <FaceScanUI
                        imageBase64Url={imageBase64Url}
                        full_name={full_name}
                        card_number={card_number}
                        t1={new Date(
                            `${selectedRecord.happenDate}T${selectedRecord.happenTime}`,
                        ).toISOString()}
                    />
                </Modal>
            )}
        </div>
    );
}
