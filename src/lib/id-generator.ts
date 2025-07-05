import prisma from './prisma';

/**
 * Generate single next ID like 'PRCHS0004'
 */
export async function generateNextId(
  prefix: string,
  table: keyof typeof prisma,
  field: string
): Promise<string> {
  const last = await (prisma[table] as any).findFirst({
    where: {
      [field]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  });

  const lastNumber = last ? parseInt(last[field].replace(prefix, '')) : 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Generate multiple next IDs like ['PRCHSITM0007', 'PRCHSITM0008']
 */
export async function generateNextIds(
  prefix: string,
  table: keyof typeof prisma,
  field: string,
  count: number
): Promise<string[]> {
  const last = await (prisma[table] as any).findFirst({
    where: {
      [field]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  });

  const lastNumber = last ? parseInt(last[field].replace(prefix, '')) : 0;

  return Array.from(
    { length: count },
    (_, i) => `${prefix}${String(lastNumber + i + 1).padStart(4, '0')}`
  );
}
