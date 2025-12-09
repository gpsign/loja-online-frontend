"use client";
import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsLeft,
  ChevronsRight,
  ImageOff,
  LoaderCircleIcon,
  Package,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderType, setOrderType] = useState<"asc" | "desc">("desc");
  const [size, setSize] = useState(20);
  const { data, meta, isLoading } = useApi<
    ProductWithImages[],
    { total: number }
  >({
    url: "/products",
    queryKey: ["products", page, search, orderBy, orderType, size],
    payload: {
      page,
      search,
      orderBy,
      orderType,
      size,
    },
  });

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search, orderBy, orderType, size]);

  useEffect(() => {
    if (isLoading) return;
    const html = document.querySelector("html") as HTMLDivElement | null;
    html?.scrollTo({ top: 0, behavior: "smooth" });
  }, [data, isLoading]);

  const total = meta?.total ?? 0;
  const totalPag = Math.ceil(total / size);

  const sortList: Record<string, string> = {
    createdAt: "Data de criação",
    price: "Preço",
    name: "Nome",
  };

  const toggleOrderType = () => {
    setOrderType((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const changePage = (n: number) => {
    return () => {
      setPage((p) => Math.max(Math.min(totalPag, p + n), 0));
    };
  };

  return (
    <div className="w-full space-y-6 py-4 pt-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={orderBy} onValueChange={setOrderBy}>
            <SelectTrigger className="w-[180px] h-10 border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortList).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={toggleOrderType}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-input"
            title={orderType === "asc" ? "Crescente" : "Decrescente"}
          >
            {orderType === "asc" ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown size={16} />
            )}
          </Button>

          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={10}>20 itens</option>
            <option value={20}>40 itens</option>
            <option value={50}>80 itens</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {Array.from({ length: size }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
          >
            {Number(data?.length) > 0 ? (
              data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="h-20 w-20 mb-2 opacity-20" />
                <p className="opacity-50 text-[24px]">
                  Nenhum produto encontrado.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {Number(data?.length) > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Mostrando página <span className="font-medium">{page}</span> de{" "}
            <span className="font-medium">{totalPag}</span> ({total} resultados)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={changePage(-page)}
              disabled={page === 1 && !isLoading}
              className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
              title="Primeira página"
            >
              <ChevronsLeft />
            </Button>
            <Button
              onClick={changePage(-1)}
              disabled={page === 1 && !isLoading}
              className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
            >
              Anterior
            </Button>
            <Button
              onClick={changePage(1)}
              disabled={page >= totalPag && !isLoading}
              className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
            >
              Próxima
            </Button>
            <Button
              onClick={changePage(totalPag - page)}
              disabled={page >= totalPag && !isLoading}
              className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
              title="Última página"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

function ProductCard({ product }: { product: ProductWithImages }) {
  const mainImage = product.images?.[0]?.imageUrl;

  const [added, setAdded] = useState(false);

  const isOutOfStock =
    !product.config?.isStockInfinite && product.stockQuantity <= 0;
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={product.name}
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

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-3 py-1 text-sm font-bold text-white bg-black/60 rounded-full backdrop-blur-sm">
              Esgotado
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

          <Button
            disabled={isOutOfStock || isLoading || added}
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
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col border rounded-xl overflow-hidden bg-white h-[420px]">
      <Skeleton className="h-64 w-full" />

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        <Skeleton className="h-4 w-full mt-1 opacity-60" />

        <div className="mt-auto flex justify-between items-center">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
