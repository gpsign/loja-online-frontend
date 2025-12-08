"use client";
import PrivateRoute from "@/components/PrivateRouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";
import { motion } from "framer-motion";
import { ShieldCheck, Truck } from "lucide-react";
import React, { Usable, useState } from "react";
import ProductActions from "./ProductActions";
import ProductHeader from "./ProductHeader";

interface PageProps {
  params: Usable<{
    id: string;
  }>;
}

export default function ProductDetail({ params }: PageProps) {
  const [quantity, setQuantity] = useState(1);

  const { id } = React.use<{ id: string }>(params);

  const { data: product, isLoading } = useApi<ProductWithImages>({
    url: "/products/" + id,
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (!product) {
    return null;
  }

  const images = product.images ?? [];

  return (
    <PrivateRoute>
      <div className="container mx-auto px-4 py-8 md:py-6">
        <ProductHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative overflow-hidden rounded-2xl border bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={`${product.name} - ${index}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>

            <div className="flex gap-2 justify-center overflow-x-auto py-2">
              {images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img.imageUrl}
                  className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:border-black transition-all"
                  alt={img.imageUrl}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
            </div>

            <div className="text-4xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </div>

            <div className="text-gray-600 leading-relaxed border-t border-b py-6">
              {product.description ||
                "Este produto não possui uma descrição detalhada disponível."}
            </div>

            <ProductActions
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-gray-50/50">
                <Truck size={24} className="text-blue-600" />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">Entrega Expressa</p>
                  <p className="text-gray-500">Para todo o Brasil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-gray-50/50">
                <ShieldCheck size={24} className="text-green-600" />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">Compra Segura</p>
                  <p className="text-gray-500">Garantia total de 30 dias</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PrivateRoute>
  );
}
