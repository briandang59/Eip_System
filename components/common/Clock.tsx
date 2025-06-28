'use client'
import { useEffect, useState } from 'react'
import { useLocation } from '@/utils/contexts/LocationContext';

const TIMEZONES = {
    'hcm': 'Asia/Ho_Chi_Minh',
    'tw': 'Asia/Taipei',
    'pc': 'Asia/Shanghai'
};

function Clock() {
    const [time, setTime] = useState(new Date());
    const { location } = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const timeString = date.toLocaleTimeString('en-US', { 
            timeZone: TIMEZONES[location as keyof typeof TIMEZONES],
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        return `${year}-${month}-${day} ${timeString}`;
    };

    return (
        <div className="text-base font-medium">
            {formatDateTime(time)}
        </div>
    )
}

export default Clock