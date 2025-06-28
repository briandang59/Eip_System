'use client';
import { Select } from 'antd';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/utils/contexts/LocationContext';

const SwitchLocation = () => {
    const { location, setLocation } = useLocation();

    const locations = [
        { value: 'hcm', label: 'Hồ Chí Minh', timezone: 'Asia/Ho_Chi_Minh' },
        { value: 'tw', label: 'Taiwan', timezone: 'Asia/Taipei' },
        { value: 'pc', label: 'Phúc Châu', timezone: 'Asia/Shanghai' },
    ];

    return (
        <Select
            size="large"
            style={{ width: 150, border: 'none' }}
            value={location}
            onChange={(value) => setLocation(value)}
            suffixIcon={<MapPin className="w-4 h-4" />}
        >
            {locations.map((loc) => (
                <Select.Option key={loc.value} value={loc.value}>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {loc.label}
                    </div>
                </Select.Option>
            ))}
        </Select>
    );
};

export default SwitchLocation;
