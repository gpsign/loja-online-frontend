"use client";
import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { ProductFormValues, productSchema } from "@/schemas";
import { Any, ProductWithImages } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PackageOpenIcon, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Usable, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface PageProps {
  params: Usable<{
    id: string;
  }>;
}

export default function ProductEditPage({ params }: PageProps) {
  const { id } = React.use<{ id: string }>(params);

  const { data: product } = useApi<ProductWithImages>({
    url: "/products/" + id,
    queryKey: ["product" + id],
  });

  return <Page>{product && <EditProduct product={product} />}</Page>;
}

function EditProduct({ product }: { product: ProductWithImages }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = usePrivateContext().user;

  const { request: submit, isLoading } = useApi({
    url: "/products/" + product.id,
    method: "PUT",
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema as Any),
    defaultValues: {
      status: product.status,
      name: product.name,
      price: product.price,
      description: product.description ?? "",
      stockQuantity: product.stockQuantity,
      config: product.config,
      images: product.images,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          append({
            imageUrl: reader.result as string,
            isCover: fields.length === 0,
            displayOrder: fields.length,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const setCover = (index: number) => {
    fields.forEach((_, i) => update(i, { ...fields[i], isCover: i === index }));
  };

  async function onSubmit(values: ProductFormValues) {
    submit(values, {
      onSuccess: () => {
        router.push("/product/" + product.id);
        toast.success("Produto editado com sucesso!", {
          richColors: true,
          position: "top-right",
        });
        queryClient.invalidateQueries();
      },
    });
  }

  const allow = product.sellerId === user.id || user.role === "admin";

  useEffect(() => {
    if (allow) return;
    router.push("/home");
  }, [allow, router]);

  if (!allow) return null;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <PageTitle
            title="Editar Produto"
            icon={<PackageOpenIcon className="h-8 w-8 text-gray-900" />}
          >
            <Button
              disabled={isLoading}
              className="w-fit ml-auto bg-green-200 hover:bg-green-300 text-green-900"
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)}
            >
              Salvar
            </Button>
          </PageTitle>
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Informações Gerais</CardTitle>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 align-middle h-auto">
                    <FormControl>
                      <Switch
                        checked={field.value === "active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "active" : "inactive")
                        }
                      />
                    </FormControl>
                    <FormLabel>Produto ativo</FormLabel>
                  </FormItem>
                )}
              />
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Ex: Teclado Mecânico RGB"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <NumericFormat
                          customInput={Input}
                          name={field.name}
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue);
                          }}
                          prefix="R$ "
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          placeholder="R$ 0,00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex align-center w-full items-baseline-last gap-4">
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={form.watch("config.isStockInfinite")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="config.isStockInfinite"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 align-middle h-auto">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Estoque Infinito</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagens do Produto</CardTitle>
            </CardHeader>
            <CardContent className="gap-y-4 flex flex-col">
              <label className="w-full sm:w-[50%] mx-auto shrink-0 border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="h-8 w-8 text-slate-400" />
                <span className="text-xs text-slate-500 mt-2">
                  Upload Imagem
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative group border rounded-lg p-2 bg-slate-50 aspect-3/2"
                  >
                    <Image
                      unoptimized={true}
                      fill
                      src={field.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <Button
                        size="icon"
                        variant={field.isCover ? "default" : "secondary"}
                        className="h-7 w-7"
                        onClick={() => setCover(index)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            field.isCover ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs mt-1 text-center font-medium">
                      Ordem: {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
