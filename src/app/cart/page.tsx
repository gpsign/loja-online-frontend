"use client";

import PrivateRoute from "@/components/PrivateRouter";
import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import { CartItem } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  LoaderCircleIcon,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  return (
    <PrivateRoute>
      <Cart />
    </PrivateRoute>
  );
}

function Cart() {
  const router = usePrivateContext().router;
  const queryClient = useQueryClient();
  const { data, request } = useApi<CartItem[]>({
    url: "/cart",
    queryKey: ["cart-items"],
  });

  const refetchCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    request();
  };

  const items = data ?? [];

  const { request: checkout, isLoading: isCheckingOut } = useApi({
    url: "/orders",
    method: "POST",
    mutationOptions: {
      onSuccess: () => {
        toast.success("Pedido enviado!", {
          position: "top-right",
          richColors: true,
        });
        refetchCart();
      },
    },
  });

  const subtotal = items?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Meu Carrinho
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* --- LISTAGEM DE PRODUTOS --- */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="hidden md:table-header-group bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[400px]">Produto</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group border-b last:border-0"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.product.images[0]?.imageUrl}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-gray-900 line-clamp-1">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.product.price)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Quantity item={item} refetchCart={refetchCart} />
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </TableCell>

                        <TableCell className="text-right">
                          <RemoveItem
                            refetchCart={refetchCart}
                            productId={item.productId}
                          />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 border-2 border-dashed rounded-3xl space-y-4 bg-gray-50/50"
              >
                <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto shadow-sm border">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Seu carrinho está vazio
                  </h3>
                  <p className="text-gray-500">
                    Parece que você ainda não escolheu nenhum produto.
                  </p>
                </div>
                <Link
                  href="/home"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/home");
                  }}
                  passHref
                >
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                    Voltar para a Loja
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-2xl p-6 bg-white shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Resumo do Pedido
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="pt-3 border-t flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <Button
              disabled={items.length === 0 || isCheckingOut}
              onClick={() => checkout()}
              className="w-full h-12 text-lg bg-black hover:bg-gray-800 transition-all rounded-full group"
            >
              {isCheckingOut ? (
                <LoaderCircleIcon className="ml-2 h-5 w-5" />
              ) : (
                <>
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Taxas e impostos calculados no checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Quantity({
  item,
  refetchCart,
}: {
  refetchCart: VoidFunction;
  item: CartItem;
}) {
  const productId = item.productId;
  const [quantity, setQuantity] = useState(item.quantity);
  const { request: changeQuantity, isLoading } = useApi({
    url: "/cart",
    method: "PUT",
    payload: { quantity, productId },
    mutationOptions: {
      onSuccess: () => {
        refetchCart();
      },
    },
  });

  const updateQuantity = (n: number) => {
    const newQuantity = quantity + n;
    setQuantity(newQuantity);
    changeQuantity({ quantity: newQuantity, productId });
  };

  return (
    <div className="flex items-center justify-center gap-2 border rounded-md w-fit mx-auto px-1 py-1">
      <Button
        disabled={isLoading}
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gray-100"
        onClick={() => updateQuantity(-1)}
      >
        {isLoading ? <LoaderCircleIcon size={14} /> : <Minus size={14} />}
      </Button>
      <span className="w-8 text-sm font-medium">{item.quantity}</span>
      <Button
        disabled={isLoading}
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gray-100"
        onClick={() => updateQuantity(1)}
      >
        <Plus size={14} />
      </Button>
    </div>
  );
}

function RemoveItem({
  refetchCart,
  productId,
}: {
  refetchCart: VoidFunction;
  productId: number;
}) {
  const { request: removeItem, isLoading: isRemoving } = useApi({
    url: "/cart",
    method: "DELETE",
    payload: { productId },
    mutationOptions: {
      onSuccess: () => {
        toast.success("Removido produto do carrinho", {
          position: "top-right",
          richColors: true,
        });
        refetchCart();
      },
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-400 hover:text-red-600 transition-colors"
      onClick={() => removeItem()}
    >
      {isRemoving ? <LoaderCircleIcon size={18} /> : <Trash2 size={18} />}
    </Button>
  );
}
