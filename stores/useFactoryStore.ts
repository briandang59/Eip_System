import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FactoryState {
    selectedFactoryId: number;
    setSelectedFactoryId: (factoryId: number) => void;
    resetFactory: () => void;
    initializeFromUserInfo: (userWorkPlaceId: number) => void;
}

const DEFAULT_FACTORY_ID = 0;

export const useFactoryStore = create<FactoryState>()(
    persist(
        (set, get) => ({
            selectedFactoryId: DEFAULT_FACTORY_ID,
            setSelectedFactoryId: (factoryId: number) => {
                set({ selectedFactoryId: factoryId });
            },
            resetFactory: () => {
                set({ selectedFactoryId: DEFAULT_FACTORY_ID });
            },
            initializeFromUserInfo: (userWorkPlaceId: number) => {
                const currentState = get();
                // Chỉ set từ user info nếu chưa có giá trị trong store (tức là lần đầu load)
                if (currentState.selectedFactoryId === DEFAULT_FACTORY_ID && userWorkPlaceId) {
                    set({ selectedFactoryId: userWorkPlaceId });
                }
            },
        }),
        {
            name: 'factory-storage', // tên key trong localStorage
            partialize: (state) => ({ selectedFactoryId: state.selectedFactoryId }), // chỉ lưu selectedFactoryId
        },
    ),
);
