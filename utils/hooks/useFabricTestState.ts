import { useState, useEffect } from 'react';
import { FabricTypeTestResponseType } from '@/types/response/fabricTest';

export const useFabricTestState = (
    fabricManagemnentTypesTests: FabricTypeTestResponseType[] | undefined,
) => {
    const [selectedFabricTest, setSelectedFabricTest] = useState<
        FabricTypeTestResponseType | undefined
    >(fabricManagemnentTypesTests?.[0]);

    // Reset selectedFabricTest when fabricManagemnentTypesTests changes
    useEffect(() => {
        if (fabricManagemnentTypesTests && fabricManagemnentTypesTests.length > 0) {
            setSelectedFabricTest(fabricManagemnentTypesTests[0]);
        } else {
            setSelectedFabricTest(undefined);
        }
    }, [fabricManagemnentTypesTests]);

    return {
        selectedFabricTest,
        setSelectedFabricTest,
    };
};
