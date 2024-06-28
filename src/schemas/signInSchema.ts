import {z} from 'zod';

const signInSchema = z.object({
  identifier: z
    .string()
    .min(2, {message: 'Username or email must be atleast 2 characters'})
    .max(50, {message: 'Username or email must be atmost 50 characters'}),
  password: z
    .string()
    .min(8, {message: 'Password must be atleast 8 characters'})
    .max(30, {message: 'Password must be atmost 30 characters'}),
});

export {signInSchema};
