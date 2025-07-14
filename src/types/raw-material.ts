export type RawMaterial = {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  safetyStock: number;
  description?: string;
  createdAt: string | number | Date;
};

export type RawMaterialDetail = RawMaterial & {
  suppliers: {
    id: string;
    name: string;
    price: number;
    minOrder: number;
  }[];
};

export type RawMaterialFormData = {
  name: string;
  description?: string;
  unit: string;
  minStock: number;
  maxStock: number;
  safetyStock: number;
  suppliers: {
    supplierId: string;
    price: number;
    minOrder: number;
  }[];
};
