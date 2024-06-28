import {z} from 'zod';

const signUpSchema = z.object({
  username: z
    .string()
    .min(2, {message: 'Username must be atleast 2 characters'})
    .max(20, {message: 'Username must be atmost 20 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username must contain only letters, numbers and underscores',
    }),
  email: z.string().email({message: 'Invalid email'}),
  password: z
    .string()
    .min(8, {message: 'Password must be atleast 8 characters'})
    .max(30, {message: 'Password must be atmost 30 characters'}),
  fullName: z
    .string()
    .min(6, {message: 'Full name must be atleast 6 characters'})
    .max(20, {message: 'Full name must be atmost 20 characters'}),
});

export {signUpSchema};
