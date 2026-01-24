/**
 * User type definitions
 * Defines the structure and validation schema for user data
 */

import { z } from 'zod';

/**
 * User interface representing the core user entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Zod schema for validating user data
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for user creation input validation
 */
export const CreateUserInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
});

/**
 * Schema for user update input validation
 */
export const UpdateUserInputSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1, 'First name must be at least 1 character').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name must be at least 1 character').max(50, 'Last name too long').optional(),
});

/**
 * Type for user creation input
 */
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

/**
 * Type for user update input
 */
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;