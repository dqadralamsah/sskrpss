export type PurchaseRequest = {
  description?: string;
  createdAt: string | number | Date;
  id: string;
  status: string;
  requestedBy: { name: string };
  approvedBy: { name: string };
  requestDate: string;
  items: {
    id: string;
    quantity: number;
    rawMaterial: { name: string };
  }[];
};
