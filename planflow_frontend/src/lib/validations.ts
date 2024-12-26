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

export const projectSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().min(2),
  start_date: z.string().min(10),
  end_date: z.string().min(10),
  priority: z.enum(["high", "medium", "low"]),
  category: z.string().min(2).max(50),
  status: z.enum(["not_started", "in_progress", "completed"]),
  image1: z.any().optional(),
  image2: z.any().optional(),
});
