export type StockMutation = {
  id: string;
  type: 'IN' | 'OUT';
  sourceType: 'PO' | 'MANUAL' | 'USAGE' | 'OPNAME';
  quantity: number;
  description: string | null;
  rawMaterialId: string;
  createdAt: string;
};

export type StockMutationFormData = Omit<StockMutation, 'id' | 'createdAt'>;
