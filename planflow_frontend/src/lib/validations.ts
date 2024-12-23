import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password1: z.string().min(8),
  password2: z.string().min(8),
});

export const signInSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});
