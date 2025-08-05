'use client';

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

    // ✅ Tạo ID duy nhất nếu không truyền vào
    const editorHolderId = useMemo(
        () => holder || `editorjs-${Math.random().toString(36).substring(2, 9)}`,
        [holder],
    );

    // ✅ Trạng thái mounted
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Chỉ render khi mounted ở client
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const editor = new EditorJS({
            holder: editorHolderId,
            placeholder: 'Viết nội dung ở đây...',
            autofocus: true,
            data: data || { blocks: [] },
            tools: {
                header: {
                    class: Header as any,
                    config: {
                        placeholder: 'Nhập tiêu đề...',
                        levels: [1, 2, 3, 4],
                        defaultLevel: 2,
                    },
                },
                list: {
                    class: List as any,
                    inlineToolbar: true,
                },
                paragraph: {
                    class: Paragraph as any,
                    inlineToolbar: true,
                },
                delimiter: Delimiter,
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Nhập câu trích dẫn',
                        captionPlaceholder: 'Tác giả',
                    },
                },
            },
            onReady: () => {
                editorRef.current = editor;
            },
            onChange: async () => {
                if (onChange && editorRef.current) {
                    try {
                        const outputData = await editorRef.current.save();
                        onChange(outputData);
                    } catch (error) {
                        console.error('Lỗi khi lưu dữ liệu editor:', error);
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

    // ✅ Chỉ render `div` khi đã mount
    return isMounted ? (
        <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium">{label}</p>
            <div
                id={editorHolderId}
                className="border border-[#ccc] rounded min-h-[300px] prose max-w-none max-h-[300px] overflow-y-auto !p-6"
            />
        </div>
    ) : null;
}
