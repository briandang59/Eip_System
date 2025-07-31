import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

export const useFabricGrid = () => {
    const { t } = useTranslationCustom();

    return {
        headers: [
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
        datas: [['', '', '', '', '', '', '', '', '', '']],
        cols: [
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
            { type: 'text' },
        ],
    };
};
