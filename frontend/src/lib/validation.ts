import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
    'Password must contain at least one letter, one number, and one special character',
  );

export const signupSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
