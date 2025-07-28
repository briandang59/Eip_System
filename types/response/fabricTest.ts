export type FabricTypeTestResponseType = {
    id: number;
    fabric_code: string;
    temperature: number;
    duration: number;
    pre_wash_weight: number;
    post_wash_weight: number;
    pre_wash_warp: number;
    post_wash_warp: number;
    warp_shrinkage_rate: number;
    pre_wash_weft: number;
    post_wash_weft: number;
    weft_shrinkage_rate: number;
    test_date: string;
    notes: string;
    created_at: string;
    updated_at: string | null;
    fabric_types: {
        customer_id: string;
        fabric_code: string;
        fabric_name: string;
    };
};
