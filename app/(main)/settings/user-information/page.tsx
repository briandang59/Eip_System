'use client';
import { useEmployees } from '@/apis/useSwr/employees';
import ProfileUI from '@/components/ui/profileUI';
import { getInfomation } from '@/utils/functions/getInfomation';

function UserInformation() {
    const myInfo = getInfomation();
    const { employees } = useEmployees({ card_number: myInfo?.card_number });
    return <div>{employees && <ProfileUI employee={employees[0]} />}</div>;
}

export default UserInformation;
