'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';

interface EditorComponentProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
    holder?: string;
    label?: string;
}

export default function EditorComponent({ data, onChange, holder, label }: EditorComponentProps) {
    const editorRef = useRef<EditorJS | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const editorHolderId = useMemo(() => {
        return holder || `editorjs-${Math.random().toString(36).substring(2, 9)}`;
    }, [holder]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const editor = new EditorJS({
            holder: editorHolderId,
            placeholder: 'Viết nội dung ở đây...',
            autofocus: true,
            data: data || { blocks: [] },
            tools: {
                header: Header as unknown as any,
                list: List as unknown as any,
                paragraph: Paragraph as unknown as any,
                delimiter: Delimiter as unknown as any,
                quote: Quote as unknown as any,
            },
            onReady: () => {
                editorRef.current = editor;
            },
            onChange: async () => {
                if (onChange && editorRef.current) {
                    try {
                        const outputData = await editorRef.current.save();
                        onChange(outputData);
                    } catch (err) {
                        console.error('Lỗi khi lưu dữ liệu EditorJS:', err);
                    }
                }
            },
        });

        return () => {
            editor.isReady
                .then(() => {
                    editor.destroy();
                    editorRef.current = null;
                })
                .catch((err) => console.error('Destroy EditorJS failed:', err));
        };
    }, [editorHolderId, isMounted]);

    return isMounted ? (
        <div className="flex flex-col gap-2">
            {label && <p className="text-[16px] font-medium">{label}</p>}
            <div
                id={editorHolderId}
                className="border border-[#ccc] rounded min-h-[300px] prose max-w-none max-h-[300px] overflow-y-auto !p-6"
            />
        </div>
    ) : null;
}
