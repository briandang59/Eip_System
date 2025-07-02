// GC là giờ công
// NL là số giờ nghỉ phép
// B là số giờ nghỉ phép năm
// D là số giờ nghỉ phép đặc biệt

export const calculateSGC = (GC: number = 0, NLE: number = 0, B: number = 0, D: number = 0) => {
    let sgc = 0;
    sgc = GC + NLE + B + D;
    return sgc;
};
