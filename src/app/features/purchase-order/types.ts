// =======================
// Shared Types
// =======================

export type User = {
  id: string;
  name: string;
};

export type Supplier = {
  id: string;
  name: string;
};

export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
};

// =======================
// Purchase Request Types
// =======================

export type ApprovedPurchaseRequest = {
  id: string;
  status: string;
  requestedBy: User;
  approvedBy: User;
  createdAt: string;
};

export type PurchaseRequestItem = {
  id: string;
  rawMaterial: RawMaterial;
  quantity: number;
};

// =======================
// Purchase Order Types
// =======================

export type PurchaseOrder = {
  id: string;
  supplier: Supplier;
  createdBy: User;
  status: string;
  createdAt: string;
};

// =======================
// Purchase Order Types (REVISED)
// =======================

// Dipakai untuk form create / edit PO
export type PurchaseOrderFormData = {
  supplierId: string;
  estimatedDate: string;
  orderNotes?: string;
  items: {
    rawMaterialId: string;
    quantity: number;
    unitPrice: number;
    minOrder: number;
    purchaseRequestItemId?: string; //  relasi opsional ke PR Item
  }[];
};

// Detail tiap item di halaman detail PO
export type PurchaseOrderItemDetail = {
  id: string;
  rawMaterial: {
    id: string;
    name: string;
    unit: string; // tambahkan ini jika ada di RawMaterial
  };
  quantity: number;
  unitPrice: number;
  status: string; // PENDING | DELIVERY | RECEIVED | CANCELLED
  receivedQty: number;
  receivedDate?: string;
  receivedBy?: User;
};

// Detail lengkap untuk halaman Detail Purchase Order
export type PurchaseOrderDetail = {
  id: string;
  status: string;
  estimatedDate: string; //  tambahan dari schema
  createdAt: string;
  supplier: Supplier;
  createdBy: User;
  orderNotes?: string;
  items: PurchaseOrderItemDetail[];
  totalPrice: number;
};
