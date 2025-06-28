'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/useLanguageStore';

export const LanguageHydration = () => {
    const hydrate = useLanguageStore((state) => state.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return null;
};

export default LanguageHydration;
