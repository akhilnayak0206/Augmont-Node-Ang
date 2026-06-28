import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    image: z
      .string()
      .url('Invalid image URL')
      .optional()
      .nullable(),
    price: z.number().positive('Price must be positive'),
    categoryId: z
      .string()
      .uuid('Invalid category ID'),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters')
      .optional(),
    image: z
      .string()
      .url('Invalid image URL')
      .optional()
      .nullable(),
    price: z
      .number()
      .positive('Price must be positive')
      .optional(),
    categoryId: z
      .string()
      .uuid('Invalid category ID')
      .optional(),
  }),
});