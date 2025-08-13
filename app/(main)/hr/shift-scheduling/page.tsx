import ShiftScheduling from '@/components/pages/shiftScheduling';
import { Suspense } from 'react';

function ShiftSchedulingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShiftScheduling />
        </Suspense>
    );
}

export default ShiftSchedulingPage;
