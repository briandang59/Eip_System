import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

export const useFabricGrid = () => {
    const { t } = useTranslationCustom();

    return {
        headers: [
            '',
            t.fabric_management_type.form.temperature,
            t.fabric_management_type.form.duration,
            t.fabric_management_type.form.pre_wash_weight,
            t.fabric_management_type.form.post_wash_weight,
            t.fabric_management_type.form.pre_wash_warp,
            t.fabric_management_type.form.post_wash_warp,
            t.fabric_management_type.form.pre_wash_weft,
            t.fabric_management_type.form.post_wash_weft,
            t.fabric_management_type.form.test_date,
            t.fabric_management_type.form.notes,
        ],
        datas: [['', '', '', '', '', '', '', '', '', '', '']],
        cols: [
            { data: 0, readOnly: true },
            { data: 1, type: 'text' },
            { data: 2, type: 'text' },
            { data: 3, type: 'text' },
            { data: 4, type: 'text' },
            { data: 5, type: 'text' },
            { data: 6, type: 'text' },
            { data: 7, type: 'text' },
            { data: 8, type: 'text' },
            { data: 9, type: 'text' },
            { data: 10, type: 'text' },
        ],
    };
};
