'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface FabricTestData {
    id: number;
    test_date: string;
    warp_shrinkage_rate: number;
    weft_shrinkage_rate: number;
}

interface ShrinkageRateChartProps {
    data: FabricTestData[];
}

const ShrinkageRateChart: React.FC<ShrinkageRateChartProps> = ({ data }) => {
    const { t } = useTranslationCustom();
    const categories = data.map((d) => d.test_date);
    const warpData = data.map((d) => parseFloat(d.warp_shrinkage_rate.toFixed(2)));
    const weftData = data.map((d) => parseFloat(d.weft_shrinkage_rate.toFixed(2)));

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 400,
            toolbar: {
                show: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.7,
                opacityTo: 0.2,
            },
        },
        xaxis: {
            categories,
            title: {
                text: t.fabric_management_type.analysis.test_date,
            },
        },
        yaxis: {
            title: {
                text: t.fabric_management_type.analysis.shrinkage_rate,
            },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val: number) => `${val.toFixed(2)}%`,
            },
        },
        colors: ['#1E90FF', '#FF1493'],
        legend: {
            position: 'top',
        },
    };

    const series = [
        {
            name: t.fabric_management_type.analysis.warp_shrinkage_rate,
            data: warpData,
        },
        {
            name: t.fabric_management_type.analysis.weft_shrinkage_rate,
            data: weftData,
        },
    ];

    return (
        <div className="mt-6">
            <ApexChart options={options} series={series} type="area" height={400} />
        </div>
    );
};

export default ShrinkageRateChart;
