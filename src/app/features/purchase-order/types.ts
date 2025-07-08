export type PurchaseOrder = {
  id: string;
  supplier: { name: string };
  createdBy: { name: string };
  status: string;
  createdAt: string;
};

export type ApprovedPR = {
  id: string;
  status: string;
  requestedBy: { name: string };
  approvedBy: { name: string };
  createdAt: string;
};

export type Supplier = { id: string; name: string };
export type RawMaterial = { id: string; name: string; unit: string };
export type PurchaseRequestItem = {
  id: string;
  rawMaterial: RawMaterial;
  quantity: number;
};
