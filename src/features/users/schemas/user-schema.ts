import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().cuid().optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;