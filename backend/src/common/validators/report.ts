import { z } from 'zod';

export const createProductReportSchema = z.object({
  body: z.object({
    fileFormat: z.enum(['csv', 'xlsx']).default('csv'),
    search: z.string().optional(),
    categoryName: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
});

export const createReportJobSchema = z.object({
  body: z.object({
    reportType: z
      .string()
      .min(1, 'Report type is required'),
    fileFormat: z.enum(['csv', 'xlsx']),
    filters: z
      .record(z.string(), z.any())
      .optional()
      .nullable(),
  }),
});

export const updateReportJobSchema = z.object({
  body: z.object({
    status: z
      .enum(['pending', 'processing', 'completed', 'failed'])
      .optional(),
    filePath: z
      .string()
      .optional()
      .nullable(),
    completedAt: z
      .coerce
      .date()
      .optional()
      .nullable(),
  }),
});