import { z } from 'zod';

export const stockMutationSchema = z.object({
  rawMaterialId: z.string().min(1, 'Raw material wajib diisi'),
  type: z.enum(['IN', 'OUT'], {
    required_error: 'Tipe mutasi wajib diisi',
  }),
  sourceType: z.enum(['PO', 'MANUAL', 'USAGE', 'OPNAME'], {
    required_error: 'Sumber mutasi wajib diisi',
  }),
  sourceId: z.string().optional(),
  quantity: z
    .number({
      required_error: 'Jumlah wajib diisi',
    })
    .int('Harus berupa angka bulat')
    .positive('Harus lebih dari 0'),
  description: z.string().optional(),
});

export type StockMutationFormValues = z.infer<typeof stockMutationSchema>;
