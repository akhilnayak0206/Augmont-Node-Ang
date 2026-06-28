import { z } from 'zod';

export const createBulkUploadJobSchema = z.object({
  body: z.object({
    fileName: z.string().optional(),
  }),
});

export const updateBulkUploadJobSchema = z.object({
  body: z.object({
    status: z
      .enum(['pending', 'processing', 'completed', 'failed', 'completed_with_errors'])
      .optional(),
    totalRows: z.number().int().nonnegative().optional(),
    processedRows: z.number().int().nonnegative().optional(),
    successRows: z.number().int().nonnegative().optional(),
    failedRows: z.number().int().nonnegative().optional(),
    errorFilePath: z.string().optional().nullable(),
    errorDetails: z.string().optional().nullable(),
    completedAt: z.coerce.date().optional().nullable(),
  }),
});