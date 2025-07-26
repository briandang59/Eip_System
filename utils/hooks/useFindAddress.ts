import { VN_ADDRESS } from '@/types/printing/IEmployee';
import { useProvinces } from '@/apis/useSwr/provinces';
import { useDistricts } from '@/apis/useSwr/districts';
import { useWards } from '@/apis/useSwr/wards';

export const useFindAddress = (vn_address: VN_ADDRESS | null): null | string => {
    if (!vn_address) return null;

    if (!vn_address.province_id) return null;

    // Lấy tên tỉnh/thành phố
    const { provinces } = useProvinces();
    const province = provinces?.find((p) => p.code === vn_address.province_id) || '';
    if (!province) return null;

    // Nếu không có district_id, trả về kết quả
    if (!vn_address.district_id) return `,,${province?.name ?? ''}`;

    // Lấy tên quận/huyện
    const { districts } = useDistricts();
    const district = districts?.find((d) => d.code === vn_address.district_id) || '';
    if (!district) return `,,${province?.name ?? ''}`;

    // Nếu không có ward_id, trả về kết quả
    if (!vn_address.ward_id) return `,${district?.name ?? ''},${province?.name ?? ''}`;

    // Lấy tên phường/xã
    const { wards } = useWards();
    const ward = wards?.find((w) => w.code === vn_address.ward_id) || '';

    return ward
        ? `${ward},${district?.name ?? ''},${province?.name ?? ''}`
        : `,${district?.name ?? ''},${province?.name ?? ''}`;
};
