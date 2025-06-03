'use server';

import { SignInSchema } from './zod';
import { signIn } from './auth';
import { AuthError } from 'next-auth';

// Sign In Credential Action
export const signinCredentials = async (prevState: unknown, FormData: FormData) => {
  const validationFields = SignInSchema.safeParse(Object.fromEntries(FormData.entries()));

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validationFields.data;

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid Credentials' };
        default:
          return { message: 'Somthing Went Wrong' };
      }
    }
    throw error;
  }
};
