import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Edit3, ShoppingCart } from "lucide-react";

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
  const role =
    user.role == "customer"
      ? "customer"
      : product.sellerId === user.id
      ? "seller"
      : "customer";

  return (
    <div className="pt-4 space-y-4">
      {role === "customer" ? (
        <div className="flex flex-col sm:flex-row gap-4">
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

          <Button className="flex-1 h-12 text-lg gap-2 bg-black hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            <ShoppingCart size={20} />
            Adicionar ao Carrinho
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-12 text-lg gap-2 border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          <Edit3 size={20} />
          Editar Dados do Produto
        </Button>
      )}
    </div>
  );
}
