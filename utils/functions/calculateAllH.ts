// SGC là số giờ công
// all_leave_hours là tổng số giờ nghỉ phép
export const calculateAllH = (
    GC: number,
    NLE: number,
    A: number,
    B: number,
    C: number,
    D: number,
    KP: number,
) => {
    let AllH = 0;
    AllH = GC + A + NLE + B + C + D + KP;
    return AllH;
};
