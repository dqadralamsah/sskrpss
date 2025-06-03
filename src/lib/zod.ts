import { object, string } from 'zod/v4';

export const SignInSchema = object({
  email: string().email('Invalid Email'),
  password: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});
