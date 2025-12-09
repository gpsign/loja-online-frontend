import z from "zod";

export const productConfigSchema = z.object({
  isStockInfinite: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  price: z.coerce.number(),
  stockQuantity: z.coerce.number().min(0),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  config: productConfigSchema,
  status: z.enum(["active", "inactive"]).optional(),
  images: z.array(
    z.object({
      imageUrl: z.string(),
      isCover: z.boolean(),
      displayOrder: z.number(),
    })
  ),
});

export type ProductFormValues = z.infer<typeof productSchema>;
