export interface CardItem {
  token_data_id_hash: string;
  collection_data_id_hash: string;
  creator_address: string;
  collection_name: string;
  name: string;
  description?: string;
  max_amount: number;
  default_properties: object;
  payee_address: string;
  royalty_points_denominator: string;
  royalty_points_numerator: string;
  supply: number;
  propertyVersion: string;
  metadata_uri: string;
  listings?: {
    price?: number;
    amount?: number;
    lister?: string;
    coin_type_info?: string;
  };
}

export interface CollectionType {
  collection_data_id_hash: string;
  creator_address: string;
  collection_name: string;
  inserted_at?: string;
  owner: string | number;
  description?: string;
  maximum: number;
  metadata_uri: string;
  total_volume: number;
  supply: number;
  floor_price: number;
  owners: number;
}

export interface listType {
  label: string;
  value: string | number;
  num?: number;
}

export type CoinStore = {
  coin: {
    value: string;
  };
};
export type DiscountConfig = {
  end_time: string;
  max_count: string;
  price: string;
  proof_root: string;
  start_time: string;
  whitelist_url: string;
};

export interface LaunchpadItemType {
  launchpadId: string;
  collection_owner: string;
  desc: string;
  end_time: string;
  json_uri: string;
  maximum: string;
  public_price: string;
  public_allowed_mint: string;
  name: string;
  saleTime: number;
  royalty_payee_address: string;
  royalty_points_denominator: string;
  royalty_points_numerator: string;
  start_time: string;
  supply: string;
  collection_uri: string;
  status?: string;
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  owner: string;
  token_data_id: string;
  propertyVersion: string;
  maxcount_onetime: string;
  discount_vec: Array<DiscountConfig>;
}

export interface PendingTokenType {
  inserted_at: string;
  from_address: string;
  to_address: string;
  date: string;
  metadata_uri: string;
  creator_address: string;
  collection_name: string;
  token_data_id_hash: string;
  property_version: string;
  name: string;
}
