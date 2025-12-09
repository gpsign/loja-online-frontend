"use client";

import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";
import { formatCurrency } from "@/utils";
import {
  Check,
  Edit2Icon,
  ImageOff,
  LoaderCircleIcon,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { usePrivateContext } from "../PrivateRouter/PrivateRouterContext";
import Image from "next/image";

export default function ProductCard({
  product,
}: {
  product: ProductWithImages;
}) {
  const mainImage = product.images?.[0]?.imageUrl;
  const user = usePrivateContext().user;
  const [added, setAdded] = useState(false);

  const isOutOfStock =
    !product.config?.isStockInfinite && product.stockQuantity <= 0;

  const isInactive = product.status == "inactive";
  const router = useRouter();

  const { request: addToCart, isLoading } = useApi({
    url: "/cart",
    method: "POST",
    payload: { productId: product.id },
    mutationOptions: {
      onSuccess: () => {
        setAdded(true);
        toast.info('Adicionado produto "' + product.name + '" ao carrinho', {
          richColors: true,
        });
      },
    },
  });

  const isOwner = product.sellerId === user.id;

  return (
    <div
      className={`group cursor-pointer flex flex-col border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${
        isOutOfStock ? "opacity-75" : ""
      }`}
      onClick={() => {
        router.push("/product/" + product.id);
      }}
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-50">
        {mainImage ? (
          <Image
            fill
            src={mainImage}
            alt={product.name}
            unoptimized={true}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              isOutOfStock ? "grayscale" : ""
            }`}
          />
        ) : (
          <div
            className={
              "h-full w-full flex items-center justify-center opacity-50"
            }
          >
            <ImageOff size={64} />
          </div>
        )}

        {isOutOfStock && !isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-3 py-1 text-sm font-bold text-white bg-black/60 rounded-full backdrop-blur-sm">
              Esgotado
            </span>
          </div>
        )}

        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-3 py-1 text-sm font-bold text-white bg-black/60 rounded-full backdrop-blur-sm">
              Inativo
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description || "Descrição indisponível."}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          {isOwner ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/product/" + product.id + "/edit");
              }}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors bg-black text-white hover:bg-blue-600 shadow-md hover:shadow-lg`}
              aria-label="Editar produto"
            >
              <Edit2Icon />
            </Button>
          ) : (
            <Button
              disabled={isOutOfStock || isLoading || added || isInactive}
              onClick={(e) => {
                e.stopPropagation();
                addToCart({ productId: product.id });
              }}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors 
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
              aria-label="Adicionar ao carrinho"
              title={
                isLoading ? "" : added ? "Adicionado" : "Adicionar ao carrinho"
              }
            >
              {isLoading ? (
                <LoaderCircleIcon size={18} />
              ) : added ? (
                <Check size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
