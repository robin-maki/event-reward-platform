import { z } from 'zod';
import { AccountRole } from './account.schema';

export const createAccountSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
  name: z.string().trim(),
});
export type CreateAccountDto = z.infer<typeof createAccountSchema>;

export const updateAccountRoleSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(AccountRole),
});
export type UpdateAccountRoleDto = z.infer<typeof updateAccountRoleSchema>;
