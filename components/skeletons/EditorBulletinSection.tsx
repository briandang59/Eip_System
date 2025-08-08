import { useTranslationCustom } from '@/utils/hooks';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { Tabs } from 'antd';

const EditorComponent = dynamic(() => import('@/components/common/EditorComponent'), {
    ssr: false,
});

interface EditorBulletinSectionProps {
    contentEN: OutputData;
    contentZH: OutputData;
    contentVN: OutputData;
    setContentEN: (data: OutputData) => void;
    setContentZH: (data: OutputData) => void;
    setContentVN: (data: OutputData) => void;
}

// Helper function to compare OutputData more efficiently
const isSameOutputData = (a?: OutputData, b?: OutputData) => {
    return JSON.stringify(a?.blocks) === JSON.stringify(b?.blocks);
};

function EditorBulletinSection({
    contentEN,
    contentZH,
    contentVN,
    setContentEN,
    setContentZH,
    setContentVN,
}: EditorBulletinSectionProps) {
    const { t } = useTranslationCustom();

    // State to track if content has changed to prevent unnecessary updates
    const [lastContentEN, setLastContentEN] = useState<OutputData>(contentEN);
    const [lastContentZH, setLastContentZH] = useState<OutputData>(contentZH);
    const [lastContentVN, setLastContentVN] = useState<OutputData>(contentVN);

    // Refs to store timeout IDs
    const timeoutRefEN = useRef<NodeJS.Timeout | null>(null);
    const timeoutRefZH = useRef<NodeJS.Timeout | null>(null);
    const timeoutRefVN = useRef<NodeJS.Timeout | null>(null);

    // Debounced handlers with cursor position preservation
    const handleContentENChange = useCallback(
        (data: OutputData) => {
            // Only update if content actually changed
            if (!isSameOutputData(data, lastContentEN)) {
                if (timeoutRefEN.current) {
                    clearTimeout(timeoutRefEN.current);
                }
                timeoutRefEN.current = setTimeout(() => {
                    setContentEN(data);
                    setLastContentEN(data);
                }, 10000);
            }
        },
        [setContentEN, lastContentEN],
    );

    const handleContentZHChange = useCallback(
        (data: OutputData) => {
            // Only update if content actually changed
            if (!isSameOutputData(data, lastContentZH)) {
                if (timeoutRefZH.current) {
                    clearTimeout(timeoutRefZH.current);
                }
                timeoutRefZH.current = setTimeout(() => {
                    setContentZH(data);
                    setLastContentZH(data);
                }, 10000);
            }
        },
        [setContentZH, lastContentZH],
    );

    const handleContentVNChange = useCallback(
        (data: OutputData) => {
            // Only update if content actually changed
            if (!isSameOutputData(data, lastContentVN)) {
                if (timeoutRefVN.current) {
                    clearTimeout(timeoutRefVN.current);
                }
                timeoutRefVN.current = setTimeout(() => {
                    setContentVN(data);
                    setLastContentVN(data);
                }, 10000);
            }
        },
        [setContentVN, lastContentVN],
    );

    const tabItems = [
        {
            key: 'en',
            label: t.bulletins.form.content_en,
            children: (
                <EditorComponent
                    data={contentEN}
                    onChange={handleContentENChange}
                    label=""
                    holder="editor-en-holder"
                />
            ),
        },
        {
            key: 'zh',
            label: t.bulletins.form.content_zh,
            children: (
                <EditorComponent
                    data={contentZH}
                    onChange={handleContentZHChange}
                    label=""
                    holder="editor-zh-holder"
                />
            ),
        },
        {
            key: 'vn',
            label: t.bulletins.form.content_vn,
            children: (
                <EditorComponent
                    data={contentVN}
                    onChange={handleContentVNChange}
                    label=""
                    holder="editor-vn-holder"
                />
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                defaultActiveKey="en"
                items={tabItems}
                className="w-full"
                type="card"
                size="large"
            />
        </div>
    );
}

export default EditorBulletinSection;
