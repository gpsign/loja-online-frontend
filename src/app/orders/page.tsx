"use client";

import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import { OrderItem } from "@/types";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusLabelMap: Record<OrderItem["status"], string> = {
  canceled: "Cancelado",
  delivered: "Entregue",
  paid: "Pago",
  pending: "Aguardando aprovação",
  shipped: "Em trânsito",
};

const statusColorMap: Record<OrderItem["status"], string> = {
  canceled: "bg-red-100 text-black",
  delivered: "bg-lime-100 text-black",
  paid: "bg-purple-100 text-black",
  pending: "bg-neutral-100 text-black",
  shipped: "bg-yellow-100 text-black",
};

export default function OrderPage() {
  return (
    <Page>
      <Orders />
    </Page>
  );
}

function Orders() {
  const router = useRouter();

  const { data } = useApi<OrderItem[]>({
    url: "/orders",
    queryKey: ["orders-items"],
  });

  const items = data ?? [];

  return (
    <>
      <PageTitle
        title="Meus Pedidos"
        icon={<Truck className="h-8 w-8 text-gray-900" />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.length > 0 ? (
            items.map((o) => <Order key={o.id} data={o} />)
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 border-2 border-dashed rounded-3xl space-y-4 bg-gray-50/50"
            >
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto shadow-sm border">
                <Truck size={32} className="text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Você não fez nenhum pedido
                </h3>
                <p className="text-gray-500">
                  Finalize uma compra para aparecer aqui
                </p>
              </div>
              <Link
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/cart");
                }}
                passHref
              >
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                  Ver meu carrinho
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function Order({ data }: { data: OrderItem }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="border bg-white rounded-xl shadow-md px-6 py-4 flex flex-col gap-5">
      <div className="flex justify-between align-center">
        <h1 className="font-normal text-xl">Pedido N°{data.id}</h1>
        <Badge className={statusColorMap[data.status]}>
          {statusLabelMap[data.status]}
        </Badge>
      </div>

      <div className="border rounded-sm bg-white overflow-hidden shadow-sm">
        <Table className="overflow-hidden">
          <TableHeader className="hidden md:table-header-group bg-gray-50">
            <TableRow>
              <TableHead className="w-[400px]">Produto</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => (
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

                <TableCell className="text-center">{item.quantity}</TableCell>

                <TableCell className="text-right font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">
                {formatCurrency(
                  data.items.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                  )
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
