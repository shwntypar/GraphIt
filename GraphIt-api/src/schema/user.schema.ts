import { z } from "zod";

/*
TODO: Add some restriction for the username | sample : nigger123
*/

export const userSignupSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
