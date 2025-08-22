'use client';
import { useState } from 'react';
import { Spin, Switch, Tag, Card } from 'antd';
import { useTranslationCustom } from '@/utils/hooks';
import { useSystemMode } from '@/apis/useSwr/systemMode';
import { systemModeService } from '@/apis/services/systemMode';
import { toast } from 'sonner';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';

function SystemMode() {
    const { t, lang } = useTranslationCustom();
    const { systemModes, isLoading: isLoadingSystemMode, mutate } = useSystemMode();

    // loading riêng cho từng place
    const [loadingIds, setLoadingIds] = useState<number[]>([]);

    const handleToggle = async (placeId: number, newMode: boolean) => {
        try {
            setLoadingIds((prev) => [...prev, placeId]);
            const payload = {
                inspection: {
                    place_id: String(placeId),
                    mode: newMode,
                },
            };
            await systemModeService.modify(payload);
            toast.success(t.common.forms.successed);
            mutate();
        } catch (err) {
            toast.error(`${err}`);
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== placeId));
        }
    };

    return (
        <div className="flex flex-col gap-6 my-10 items-center">
            <h2 className="text-xl font-semibold">{t.sidebar.settings.system_mode}</h2>

            {isLoadingSystemMode ? (
                <Spin />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                    {systemModes?.map((item) => (
                        <Card
                            key={item.work_place.id}
                            className="flex justify-between items-center gap-4 shadow-sm w-full"
                        >
                            <div className="flex items-center gap-4 justify-between">
                                <span className="font-medium text-gray-700">
                                    {getLocalizedName(
                                        item.work_place.name_en,
                                        item.work_place.name_zh,
                                        item.work_place.name_vn,
                                        lang,
                                    )}
                                </span>
                                <Tag
                                    color={item.inspection ? 'green' : 'red'}
                                    className="w-fit mt-1"
                                >
                                    {item.inspection ? t.common.enable : t.common.disable}
                                </Tag>
                                <Switch
                                    checked={item.inspection}
                                    loading={loadingIds.includes(item.work_place.id)}
                                    onChange={(checked) =>
                                        handleToggle(item.work_place.id, checked)
                                    }
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SystemMode;
