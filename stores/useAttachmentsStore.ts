import { AttachmentsResponseType } from '@/types/response/bulletins';
import { create } from 'zustand';

interface AttachmentsState {
    attachments: AttachmentsResponseType[];
    setAttachments: (files: AttachmentsResponseType[]) => void;
    addAttachment: (file: AttachmentsResponseType) => void;
    removeAttachment: (id: string) => void;
    clearAttachments: () => void;
}

export const useAttachmentsStore = create<AttachmentsState>((set) => ({
    attachments: [],

    setAttachments: (files) => set({ attachments: files }),

    addAttachment: (file) =>
        set((state) => ({
            attachments: [...state.attachments, file],
        })),

    removeAttachment: (id) =>
        set((state) => ({
            attachments: state.attachments.filter((file) => file.id !== id),
        })),

    clearAttachments: () => set({ attachments: [] }),
}));
