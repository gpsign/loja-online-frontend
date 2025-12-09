import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { Product } from "@/types";
import { Check, Edit3, LoaderCircleIcon, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductActionsProps {
  setQuantity: (n: number) => void;
  quantity: number;
  product: Product;
}

export default function ProductActions({
  quantity,
  setQuantity,
  product,
}: ProductActionsProps) {
  const user = usePrivateContext().user;
  const [added, setAdded] = useState(false);
  const role =
    user.role == "customer"
      ? "customer"
      : product.sellerId === user.id
      ? "seller"
      : "customer";

  const { request: addToCart, isLoading } = useApi({
    url: "/cart",
    method: "POST",
    payload: { productId: product.id, quantity },
    mutationOptions: {
      onSuccess: () => {
        setAdded(true);
      },
    },
  });

  const isInactive = product.status == "inactive";
  const router = useRouter();
  return (
    <div className="pt-4 space-y-4">
      {role === "customer" ? (
        <div className="flex flex-col sm:flex-row gap-4">
          {!added && !isLoading && !isInactive && (
            <>
              <div className="flex items-center border rounded-lg h-12 w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:bg-gray-100 h-full rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span className="px-4 font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 hover:bg-gray-100 h-full rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                onClick={() => addToCart({ productId: product.id, quantity })}
                className="flex-1 h-12 text-lg gap-2 bg-black hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </Button>
            </>
          )}
          {(added || isLoading) && !isInactive && (
            <Button
              disabled
              className="flex-1 h-12 text-lg gap-2 bg-black hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              {isLoading ? <LoaderCircleIcon size={20} /> : <Check size={20} />}
              Adicionado ao carrinho
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => router.push("/product/" + product.id + "/edit")}
          className="w-full h-12 text-lg gap-2 border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          <Edit3 size={20} />
          Editar Dados do Produto
        </Button>
      )}
    </div>
  );
}
