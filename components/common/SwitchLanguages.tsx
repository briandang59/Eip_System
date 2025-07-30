'use client';
import { Select } from 'antd';
import Image from 'next/image';
import svgs from '@/assets/svgs';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { toast } from 'sonner';
import { languagePreferencesService } from '@/apis/services/languagePreferences';
import { getInfomation } from '@/utils/functions/getInfomation';

const VALID_LANGUAGES = ['en', 'vn', 'zh'] as const;
type Language = (typeof VALID_LANGUAGES)[number];

const SwitchLanguages = () => {
    const { lang, setLanguage } = useTranslationCustom();
    const myInfo = getInfomation();
    const handleChangeLang = async (value: string) => {
        if (!VALID_LANGUAGES.includes(value as Language)) {
            toast.error('Invalid language selected');
            return;
        }

        const newLang = value as Language;

        if (newLang === lang) return;

        try {
            if (myInfo) {
                await languagePreferencesService.modify({ language: newLang });
                setLanguage(newLang);
            } else {
                setLanguage(newLang);
            }
        } catch (error) {
            toast.error(`Failed to change language: ${error}`);
        }
    };

    return (
        <Select size="large" style={{ width: 150 }} value={lang} onChange={handleChangeLang}>
            <Select.Option value="en">
                <div className="flex items-center gap-2">
                    <Image src={svgs.en} alt="English" width={20} height={20} /> English
                </div>
            </Select.Option>
            <Select.Option value="vn">
                <div className="flex items-center gap-2">
                    <Image src={svgs.vn} alt="Vietnamese" width={20} height={20} /> Tiếng Việt
                </div>
            </Select.Option>
            <Select.Option value="zh">
                <div className="flex items-center gap-2">
                    <Image src={svgs.tw} alt="Chinese" width={20} height={20} /> 中文
                </div>
            </Select.Option>
        </Select>
    );
};

export default SwitchLanguages;
