import { FabricTestDataResponseType } from '@/types/response/analysisDataFabricTest';

export const CalculateAnalysisDatFabric = (data: FabricTestDataResponseType[]) => {
    let minTemp = 0;
    let maxTemp = 0;
    let verticalRatio = 0;
    let horizontalRatio = 0;
    let arrayTemp: number[] = [];

    if (data.length > 0) {
        minTemp = data[0].temperature;
        maxTemp = data[0].temperature;

        data.forEach((element) => {
            if (element.temperature < minTemp) {
                minTemp = element.temperature;
            }
            if (element.temperature > maxTemp) {
                maxTemp = element.temperature;
            }

            verticalRatio += element.warp_shrinkage_rate || 0;
            horizontalRatio += element.weft_shrinkage_rate || 0;
            arrayTemp.push(element.temperature);
        });

        verticalRatio = parseFloat((verticalRatio / data.length).toFixed(2));
        horizontalRatio = parseFloat((horizontalRatio / data.length).toFixed(2));
    }

    return {
        count: data.length,
        minTemp,
        maxTemp,
        verticalRatio,
        horizontalRatio,
        arrayTemp: arrayTemp.sort((a, b) => a - b),
        testDataSorted: data.sort((a, b) => a.temperature - b.temperature),
    };
};
