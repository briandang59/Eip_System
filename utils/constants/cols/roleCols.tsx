import { RoleType, WorkPlaceType } from '@/types/response/roles';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { TableColumnsType } from 'antd';

export const useRoleCols = (): TableColumnsType<RoleType> => {
    const { t } = useTranslationCustom();

    return [
        {
            title: 'Stt',
            width: 60,
            dataIndex: 'stt',
            key: 'stt',
            fixed: 'left',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t.settings.account_role.role_name_en,
            dataIndex: 'name_en',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.role_name_vn,
            dataIndex: 'name_vn',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.role_name_zh,
            dataIndex: 'name_zh',
            key: 'name_en',
            width: 200,
        },
        {
            title: t.settings.account_role.tag,
            dataIndex: 'tag',
            key: 'tag',
            width: 100,
        },
        {
            title: t.settings.account_role.description,
            dataIndex: 'description',
            key: 'description',
            width: 500,
        },
        {
            title: t.settings.account_role.work_places,
            dataIndex: 'work_places',
            key: 'work_places',
            width: 200,
            render: (work_places: WorkPlaceType[]) => {
                return (
                    <div className="flex flex-col gap-2">
                        {work_places.map((work_place) => (
                            <div key={work_place.id}>{work_place.name_en}</div>
                        ))}
                    </div>
                );
            },
        },
    ];
};
