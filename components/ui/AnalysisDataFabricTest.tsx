import { AnalysisDataFabricTestResponseType } from '@/types/response/analysisDataFabricTest';
import { CalculateAnalysisDatFabric } from '@/utils/functions/calculateAnalysDataFabric';
import { FlaskRound, ThermometerSnowflake, UnfoldHorizontal, UnfoldVertical } from 'lucide-react';
import React, { useMemo } from 'react';
import ShrinkageRateChart from '../charts/ShrinkageRateChart';
import { Spin } from 'antd';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

interface RenderBlockAnalysisProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    bgcolor: string;
    color: string;
}
interface AnalysisDataFabricTestProps {
    analysis: AnalysisDataFabricTestResponseType;
    isLoading: boolean;
}
const RenderBlockAnalysis = ({ icon, label, value, color, bgcolor }: RenderBlockAnalysisProps) => {
    return (
        <div className={`flex items-center gap-2 p-4 rounded-[10px] ${bgcolor}`}>
            <div className="p-2">{icon}</div>
            <div className="flex flex-col">
                <p className={`text-[14px] font-bold ${color}`}>{label}</p>
                <p className={`${color} font-medium text-[20px]`}>{value}</p>
            </div>
        </div>
    );
};
function AnalysisDataFabricTest({ analysis, isLoading }: AnalysisDataFabricTestProps) {
    const { t } = useTranslationCustom();
    const { count, horizontalRatio, maxTemp, minTemp, verticalRatio, arrayTemp, testDataSorted } =
        useMemo(() => {
            if (!analysis) {
                return {
                    count: 0,
                    horizontalRatio: 0,
                    maxTemp: 0,
                    minTemp: 0,
                    verticalRatio: 0,
                    arrayTemp: [],
                    testDataSorted: [],
                };
            }

            return CalculateAnalysisDatFabric(analysis.fabric_test_data);
        }, [analysis]);

    if (isLoading || !analysis) {
        return (
            <div className="p-4 text-center">
                <Spin />
            </div>
        );
    }

    const arrayAnalysis = [
        {
            icon: <FlaskRound className="!text-blue-700" />,
            label: t.fabric_management_type.analysis.total_test,
            value: count.toString() ?? '0',
            bgcolor: 'bg-blue-300',
            color: 'text-blue-700',
        },
        {
            icon: <UnfoldVertical className="!text-green-700" />,
            label: t.fabric_management_type.analysis.warp,
            value: `${horizontalRatio}%`,
            bgcolor: 'bg-green-300',
            color: 'text-green-700',
        },
        {
            icon: <UnfoldHorizontal className="!text-purple-700" />,
            label: t.fabric_management_type.analysis.weft,
            value: `${verticalRatio}%`,
            bgcolor: 'bg-purple-300',
            color: 'text-purple-700',
        },
        {
            icon: <ThermometerSnowflake className="!text-orange-700" />,
            label: t.fabric_management_type.analysis.temp,
            value: minTemp === maxTemp ? `${minTemp}°C` : `${minTemp}°C - ${maxTemp}°C`,
            bgcolor: 'bg-orange-300',
            color: 'text-orange-700',
        },
    ];

    return (
        <div className="min-h-[500px] flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-2">
                {arrayAnalysis.map((item, index) => (
                    <RenderBlockAnalysis
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        bgcolor={item.bgcolor}
                    />
                ))}
            </div>
            <ShrinkageRateChart data={testDataSorted} categories={arrayTemp} />
        </div>
    );
}

export default AnalysisDataFabricTest;
