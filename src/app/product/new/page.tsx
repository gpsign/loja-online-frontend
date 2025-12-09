"use client";

import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { ProductFormValues, productSchema } from "@/schemas/product.schema";
import { Any, NewProduct } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ClipboardX,
  FileDown,
  FileSpreadsheet,
  PackagePlus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import Image from "next/image";

export default function AddProductPage() {
  return (
    <Page>
      <AddProduct />
    </Page>
  );
}

interface CSVImport {
  name?: string;
  price?: number;
  stockQuantity?: number;
  isStockInfinite?: boolean;
  description?: string;
  image: string;
}

const downloadCSVTemplate = () => {
  const headers = [
    "name",
    "price",
    "stockQuantity",
    "isStockInfinite",
    "description",
  ];
  const csvContent =
    headers.join(",") +
    "\n" +
    "Exemplo de Produto,99.90,10,false,Uma bela descrição";

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", "modelo_produtos.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function AddProduct() {
  const [products, setProducts] = useState<NewProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const { request: submit, isLoading } = useApi({
    url: "/products",
    method: "POST",
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema as Any),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stockQuantity: 0,
      config: { isStockInfinite: true },
      images: [],
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

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const newProducts: NewProduct[] = [];

        for (const row of results.data as CSVImport[]) {
          newProducts.push({
            name: row.name || "Sem Nome",
            price: Number(row.price) || 0,
            stockQuantity: Number(row.stockQuantity) || 0,
            description: row.description || "",
            config: {
              isStockInfinite: Boolean(row.isStockInfinite),
            },
            status: "active",
            images: row.image
              ? [{ imageUrl: row.image, isCover: true, displayOrder: 0 }]
              : [],
          });
        }

        setProducts((prev) => [...prev, ...newProducts]);
        setIsProcessing(false);
      },
    });
  };
  const setCover = (index: number) => {
    fields.forEach((_, i) => update(i, { ...fields[i], isCover: i === index }));
  };

  async function onSubmit(values: ProductFormValues) {
    submit(values, {
      onSuccess: (data) => {
        const productId = (data as Any)?.[0]?.id as number;
        if (!productId) return;
        router.push("/product/" + productId);
        toast.success("Produto criado com sucesso!", {
          richColors: true,
          position: "top-right",
        });
      },
    });
  }

  const removeProduct = (product: NewProduct) => {
    setProducts(products.filter((p) => product != p));
  };

  const submitAll = async () => {
    submit(
      { products },
      {
        onSuccess() {
          toast.success("Criado produtos com sucesso!", {
            richColors: true,
            position: "top-right",
          });
          setProducts([]);
        },
        onError() {
          toast.error("Não foi possível concluir sua solicitação", {
            richColors: true,
            position: "top-right",
          });
        },
      }
    );
  };

  const discardAll = () => {
    setProducts([]);
  };

  return (
    <>
      <PageTitle
        title="Adicionar Produto"
        icon={<PackagePlus className="h-8 w-8 text-gray-900" />}
      >
        <div className="flex ml-auto gap-2">
          {products.length === 0 && (
            <>
              <Button
                variant="ghost"
                onClick={downloadCSVTemplate}
                className="hover:bg-zinc-900 hover:text-white"
              >
                <FileDown className="mr-2 h-4 w-4" /> Baixar Modelo
              </Button>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
                id="csv-upload"
              />
              <Button disabled={isProcessing} variant="outline" asChild>
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Importar CSV
                </label>
              </Button>
            </>
          )}
        </div>
      </PageTitle>

      {products.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-4 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Imagem</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {product.images[0]?.imageUrl ? (
                        <Image
                          fill
                          unoptimized={true}
                          src={product.images[0].imageUrl}
                          className="h-10 w-10 object-cover rounded border"
                          alt="Preview"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stockQuantity} un</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(product)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 flex justify-end gap-4">
              <Button
                onClick={discardAll}
                size="lg"
                className="bg-red-200 text-red-900 hover:bg-red-300"
              >
                <ClipboardX className="mr-2 h-5 w-5" /> Descartar
              </Button>
              <Button
                disabled={isLoading}
                onClick={submitAll}
                size="lg"
                className="bg-green-200 hover:bg-green-300 text-green-900"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" /> Enviar tudo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {products.length == 0 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
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
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative group border rounded-lg p-2 bg-slate-50"
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
                  <label className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
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
                </div>
              </CardContent>
            </Card>
            <Button
              disabled={isLoading}
              className="w-fit ml-auto bg-green-200 hover:bg-green-300 text-green-900"
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)}
            >
              Publicar Produto
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
