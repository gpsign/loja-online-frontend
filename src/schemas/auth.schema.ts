import * as z from "zod";

export const passwordSchema = z.string().superRefine((val, ctx) => {
  const errors = [];

  if (val.length < 8) {
    errors.push("No mínimo 8 caracteres.");
  }

  if (!/[A-Z]/.test(val)) {
    errors.push("Uma letra maiúscula.");
  }

  if (!/[a-z]/.test(val)) {
    errors.push("Uma letra minúscula.");
  }

  if (!/[0-9]/.test(val)) {
    errors.push("Um número.");
  }

  if (!/[\W_]/.test(val)) {
    errors.push("Um caractere especial (ex: !@#$).");
  }

  if (errors.length) {
    ctx.addIssue({
      code: "custom",
      message: "A senha deve conter:\n\t• " + errors.join("\n\t• "),
    });
  }
});

export const loginSchema = z.object({
  email: z.email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string(),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),
    email: z.email({
      message: "Por favor, insira um e-mail válido.",
    }),
    password: passwordSchema,
    role: z.enum(["seller", "customer"]),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
