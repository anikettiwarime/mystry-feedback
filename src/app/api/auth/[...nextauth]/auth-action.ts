'use server';

import {checkUser, signIn} from './auth';

interface SignInParams {
  redirect?: boolean;
  identifier: string;
  password: string;
}

export async function SignIn(
  provider: string,
  {redirect = true, identifier, password}: SignInParams
) {
  try {
    await checkUser({identifier, password});

    return await signIn(provider, {
      redirect,
      identifier,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
