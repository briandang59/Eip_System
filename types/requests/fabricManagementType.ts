export type FabricManagementTypeRequestType = {
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
    raw_fabric_spec: string | null;
    finished_product_spec: string | null;
};
