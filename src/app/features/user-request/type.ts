export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
};

export type PurchaseRequestItem = {
  id: string;
  quantity: number;
  rawMaterial: RawMaterial;
};

export type PurchaseRequest = {
  id: string;
  items: PurchaseRequestItem[];
  description: string | null;
  status: string;
  approvedBy?: {
    name: string;
  } | null;
  purchaseRequestRevisionLog?: {
    revisionNote: string | null;
  }[];
};
