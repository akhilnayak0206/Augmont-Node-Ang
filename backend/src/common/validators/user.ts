import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format'),
    passwordHash: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format'),
    passwordHash: z
      .string()
      .min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format')
      .optional(),
    passwordHash: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional(),
  }),
});