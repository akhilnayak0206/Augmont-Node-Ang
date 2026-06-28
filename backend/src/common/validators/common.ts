import { z } from 'zod';

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    search: z.string().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const uniqueIdParamSchema = z.object({
  params: z.object({
    uniqueId: z.string(),
  }),
});

export const jobIdParamSchema = z.object({
  params: z.object({
    jobId: z.string().uuid('jobId must be a valid UUID'),
  }),
});