export type FabricTypesTestRequestType = {
    temperature: number;
    duration: number;
    pre_wash_weight: number;
    post_wash_weight: number;
    pre_wash_warp: number;
    post_wash_warp: number;
    pre_wash_weft: number;
    post_wash_weft: number;
    test_date: string;
    notes: string | null;
};
