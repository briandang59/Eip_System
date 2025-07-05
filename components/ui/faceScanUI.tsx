'use client';

import React from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

type Props = {
    imageBase64Url: string | null;
    full_name: string;
    card_number: string;
    t1?: string;
    t2?: string;
};

const FaceScanUI: React.FC<Props> = ({ imageBase64Url, full_name, card_number, t1, t2 }) => {
    const time = t1 || t2;
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {imageBase64Url ? (
                <Image src={imageBase64Url} alt="Face photo" width={500} height={500} unoptimized />
            ) : (
                <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-400">No image</span>
                </div>
            )}

            {
                <div className="flex flex-col gap-2 items-center">
                    <h3 className="font-bold text-lg">
                        {card_number} - {full_name}
                    </h3>
                    {time && (
                        <p className="text-green-700 font-semibold">
                            {dayjs(time).format('YYYY-MM-DD HH:mm')}
                        </p>
                    )}
                </div>
            }
        </div>
    );
};

export default FaceScanUI;
