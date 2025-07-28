export type AnalysisDataFabricTestResponseType = {
    fabric_code: string;
    customer_id: string;
    fabric_name: string;
    fabric_width: number;
    fabric_weight: number;
    warp_density: number;
    weft_density: number;
    machine_warp_density: number;
    machine_weft_density: number;
    raw_fabric_warp_density: number;
    raw_fabric_weft_density: number;
    raw_fabric_spec: string;
    finished_product_spec: string;
    created_at: string;
    updated_at: string;
    raw_fabric_width: number | null;
    raw_fabric_weight: number | null;
    fabric_test_data: FabricTestDataResponseType[];
};

export type FabricTestDataResponseType = {
    id: number;
    notes: string;
    duration: number;
    test_date: string;
    created_at: string;
    temperature: number;
    pre_wash_warp: number;
    pre_wash_weft: number;
    post_wash_warp: number;
    post_wash_weft: number;
    pre_wash_weight: number;
    post_wash_weight: number;
    warp_shrinkage_rate: number;
    weft_shrinkage_rate: number;
};
