import {z} from 'zod';

const messageSchema = z.object({
  content: z
    .string()
    .min(10, {message: 'Message must be at least 10 characters'})
    .max(300, {message: 'Message must be at most 300 characters'}),
});

export {messageSchema};