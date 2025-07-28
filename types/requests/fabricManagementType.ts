export type FabricManagementTypeRequestType = {
    fabric_code: string;
    customer_id: string | null;
    fabric_name: string | null;
    fabric_width: number | null;
    fabric_weight: number | null;
    warp_density: number | null;
    weft_density: number | null;
    machine_warp_density: number | null;
    machine_weft_density: number | null;
    raw_fabric_warp_density: number | null;
    raw_fabric_weft_density: number | null;
    raw_fabric_spec: string | null;
    finished_product_spec: string | null;
};
