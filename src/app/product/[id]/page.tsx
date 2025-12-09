"use client";
import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";
import { formatCurrency } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoaderCircle, ShieldCheck, Star, Truck } from "lucide-react";
import React, { Usable, useCallback, useEffect, useState } from "react";
import ProductActions from "./ProductActions";
import Image from "next/image";

interface PageProps {
  params: Usable<{
    id: string;
  }>;
}

export default function ProductDetail({ params }: PageProps) {
  const [quantity, setQuantity] = useState(1);

  const { id } = React.use<{ id: string }>(params);

  const { data: product } = useApi<ProductWithImages>({
    url: "/products/" + id,
    queryKey: ["product" + id],
  });

  const [embla, setEmbla] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;

    const selectHandler = () => {
      setCurrentIndex(embla.selectedScrollSnap());
    };

    embla.on("select", selectHandler);

    return () => {
      embla.off("select", selectHandler);
    };
  }, [embla]);

  const onCarouselInit = useCallback((emblaApi: CarouselApi) => {
    setEmbla(emblaApi);
  }, []);

  if (!product) {
    return null;
  }

  const images = product.images ?? [];

  const handleThumbClick = (index: number) => {
    if (!embla) return;
    embla.scrollTo(index);
  };

  return (
    <Page>
      <PageTitle />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <Carousel setApi={onCarouselInit} className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative overflow-hidden rounded-2xl border bg-gray-50">
                    <Image
                      unoptimized={true}
                      fill
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

          <div className="flex  justify-center overflow-x-auto py-2">
            {images.map((img, i) => (
              <div key={img.id} className="overflow-hidden p-2 ">
                <Image
                  width={80}
                  height={80}
                  unoptimized={true}
                  onClick={() => handleThumbClick(i)}
                  key={i}
                  src={img.imageUrl}
                  style={{ transform: currentIndex == i ? "scale(1.2)" : "" }}
                  className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:border-black transition-all"
                  alt={img.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-6"
        >
          <div className="space-y-2 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <Favorite
              isFavorite={Boolean(product.favoritedBy?.length)}
              productId={product.id}
            />
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
    </Page>
  );
}

function Favorite({
  productId,
  isFavorite,
}: {
  productId: number;
  isFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(isFavorite);

  const className = !isFavorite ? "" : "fill-yellow-400 stroke-yellow-400";
  const queryClient = useQueryClient();
  const { request, isLoading } = useApi({
    url: `/products/${productId}/favorites`,
    method: favorite ? "DELETE" : "POST",
  });

  return (
    <div
      className={isLoading ? "opacity-50" : "cursor-pointer"}
      onClick={() => {
        request(
          {},
          {
            onSuccess() {
              setFavorite((f) => !f);
              queryClient.invalidateQueries();
            },
          }
        );
      }}
    >
      {isLoading ? <LoaderCircle /> : <Star className={className} />}
    </div>
  );
}
