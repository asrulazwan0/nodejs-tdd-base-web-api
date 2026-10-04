import { z } from 'zod';

const name = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .refine((value) => !/\p{Cc}/u.test(value), 'Control characters are not allowed');
const email = z.string().trim().toLowerCase().max(254).email();
export const CreateUserInputSchema = z.object({ email, firstName: name, lastName: name }).strict();
export const UpdateUserInputSchema = CreateUserInputSchema.partial().refine(
  (value) => Object.values(value).some((field) => field !== undefined),
  'At least one field is required',
);
export const UserIdSchema = z.string().uuid();
export const ListUsersSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(100),
    offset: z.coerce.number().int().min(0).max(1000000).default(0),
  })
  .strict();
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type ListUsersInput = z.infer<typeof ListUsersSchema>;
