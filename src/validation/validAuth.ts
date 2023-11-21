import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export type ILogin = z.infer<typeof loginSchema>;
