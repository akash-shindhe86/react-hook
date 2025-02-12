export interface ConstantType {
    BANNERS: string[];
    RESPONSE_TYPE_TEXT: string;
    RESPONSE_TYPE_JSON: string;
}

type ReviewPageParams = {
    product_name: string;
    bpn: string;
};
  
type ReviewSearchParams = {
    mode: string;
    source: string;
};
  
export type ReviewProps = {
    params: ReviewPageParams;
    searchParams: ReviewSearchParams;
}