import {z} from 'zod';

const verifySchema = z.object({
  username: z
    .string()
    .min(2, {message: 'Username must be atleast 2 characters'})
    .max(20, {message: 'Username must be atmost 20 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username must contain only letters, numbers and underscores',
    }),
  code: z.string().length(6, {message: 'Verification code must be 6 digits'}),
});

export {verifySchema};
