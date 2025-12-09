import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula.",
    })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[\W_]/, {
      message:
        "A senha deve conter pelo menos um caractere especial (ex: !@#$).",
    }),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),
    email: z.email({
      message: "Por favor, insira um e-mail válido.",
    }),
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    role: z.enum(["seller", "customer"]),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
