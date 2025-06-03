import z from "zod";
export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(63)
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens",
    )
    .transform((val) => val.toLowerCase()),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
