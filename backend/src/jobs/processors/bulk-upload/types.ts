export interface RowData {
  name?: string;
  price?: string;
  categoryId?: string;
  categoryName?: string;
  image?: string;
  uniqueId?: string;
}

export interface RowError {
  row: number;
  error: string;
}

interface BatchCounts {
  processedRows: number;
  successRows: number;
  failedRows: number;
}

export type { BatchCounts };