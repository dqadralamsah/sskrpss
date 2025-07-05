export type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  materials: {
    rawMaterialId: string;
    price: number;
    minOrder: number;
    rawMaterial: {
      name: string;
    };
  }[];
};
