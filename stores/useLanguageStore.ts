import { create } from 'zustand';

type Language = 'en' | 'vn' | 'zh';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    hydrate: () => void;
}

// Default language that will be used during SSR
const DEFAULT_LANGUAGE: Language = 'en';

export const useLanguageStore = create<LanguageState>((set) => ({
    language: DEFAULT_LANGUAGE,
    setLanguage: (lang) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
        set({ language: lang });
    },
    hydrate: () => {
        if (typeof window !== 'undefined') {
            const storedLanguage = localStorage.getItem('language') as Language;
            if (storedLanguage) {
                set({ language: storedLanguage });
            }
        }
    },
}));
