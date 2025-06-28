'use client';
import { Select } from 'antd';
import Image from 'next/image';
import svgs from '@/assets/svgs';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

const SwitchLanguages = () => {
    const { lang } = useTranslationCustom();
    const setLanguage = useLanguageStore((state) => state.setLanguage);

    return (
        <Select
            size="large"
            style={{ width: 150, border: 'none' }}
            value={lang}
            onChange={(value) => setLanguage(value as 'en' | 'vn' | 'zh')}
        >
            <Select.Option value="en">
                {' '}
                <div className="flex items-center gap-2">
                    <Image src={svgs.en} alt="English" width={20} height={20} /> English
                </div>
            </Select.Option>
            <Select.Option value="vn">
                {' '}
                <div className="flex items-center gap-2">
                    <Image src={svgs.vn} alt="Vietnamese" width={20} height={20} /> Tiếng Việt
                </div>
            </Select.Option>
            <Select.Option value="zh">
                {' '}
                <div className="flex items-center gap-2">
                    <Image src={svgs.tw} alt="Chinese" width={20} height={20} /> 中文
                </div>
            </Select.Option>
        </Select>
    );
};

export default SwitchLanguages;
