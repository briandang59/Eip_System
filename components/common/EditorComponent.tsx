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

    // lưu lại lần data cuối cùng MÀ CHÍNH editor phát ra (để không render ngược lại)
    const lastEmittedRef = useRef<OutputData | null>(null);

    // so sánh blocks nhanh
    const sameBlocks = (a?: OutputData | null, b?: OutputData | null) =>
        JSON.stringify(a?.blocks ?? []) === JSON.stringify(b?.blocks ?? []);

    const editorHolderId = useMemo(
        () => holder || `editorjs-${Math.random().toString(36).substring(2, 9)}`,
        [holder],
    );

    useEffect(() => setIsMounted(true), []);

    // Khởi tạo EditorJS 1 lần
    useEffect(() => {
        if (!isMounted || editorRef.current) return;

        const editor = new EditorJS({
            holder: editorHolderId,
            placeholder: 'Viết nội dung ở đây...',
            autofocus: true,
            data: data || { blocks: [] },
            tools: {
                header: {
                    class: Header as any,
                    inlineToolbar: true,
                    config: {
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2,
                    },
                    shortcut: 'CMD+SHIFT+H',
                },

                list: {
                    class: List as any,
                    inlineToolbar: true,
                },
                paragraph: {
                    class: Paragraph as any,
                    inlineToolbar: true,
                },
                delimiter: Delimiter as any,
                quote: {
                    class: Quote as any,
                    inlineToolbar: true,
                },
            },

            onReady: () => {
                editorRef.current = editor;
            },
            onChange: async () => {
                if (!onChange || !editorRef.current) return;
                try {
                    const outputData = await editorRef.current.save();

                    // Nếu blocks giống lần trước thì bỏ qua
                    if (sameBlocks(outputData, lastEmittedRef.current)) return;

                    // Emit lên cha + ghi nhớ để tránh render lại chính nó
                    onChange(outputData);
                    lastEmittedRef.current = outputData;
                } catch (err) {
                    console.error('Lỗi khi lưu dữ liệu EditorJS:', err);
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
    }, [isMounted, editorHolderId]);

    // Nhận data từ parent: CHỈ render khi khác lastEmittedRef/current content
    useEffect(() => {
        const run = async () => {
            if (!editorRef.current) return;
            if (!data) return;

            // nếu data đến từ chính editor vừa emit ra thì bỏ qua
            if (sameBlocks(data, lastEmittedRef.current)) return;

            // có thể so sánh thêm với content hiện tại để chắc chắn:
            const current = await editorRef.current.save();
            if (sameBlocks(current, data)) return;

            await editorRef.current.render(data);
        };

        run().catch((err) => console.error('Render data failed:', err));
    }, [data]);

    return isMounted ? (
        <div className="flex flex-col gap-2">
            {label && <p className="text-[16px] font-medium">{label}</p>}
            <div
                id={editorHolderId}
                className="editorjs-holder border border-[#ccc] rounded min-h-[300px] max-h-[300px] overflow-y-auto !p-6"
            />
        </div>
    ) : null;
}
