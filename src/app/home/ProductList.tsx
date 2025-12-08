"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderType, setOrderType] = useState<"asc" | "desc">("desc");
  const [size, setSize] = useState(10);
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

  const total = meta?.total ?? 0;

  const totalPag = Math.floor(total / size);

  const sortList: Record<string, string> = {
    createdAt: "Data de criação",
    price: "Preço",
    name: "Nome",
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-xl bg-white shadow-lg p-2">
        <div className="flex gap-2">
          <Input
            placeholder="Pesquisar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={() => {
              setSearch(query);
            }}
          >
            <Search />
          </Button>
        </div>
        <div className="flex">
          <div className="flex gap-1">
            <Select value={orderBy} onValueChange={(val) => setOrderBy(val)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Ordenar"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sortList).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setOrderType(orderType === "asc" ? "desc" : "asc")}
            >
              {orderType === "asc" ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          <div className="ml-auto flex gap-1">
            <Select
              value={String(size)}
              onValueChange={(val) => setSize(Number(val))}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tamanho"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(10)}>{10}</SelectItem>
                <SelectItem value={String(20)}>{20}</SelectItem>
                <SelectItem value={String(50)}>{50}</SelectItem>
                <SelectItem value={String(100)}>{100}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setPage(1)}>
              <ChevronsLeft />
            </Button>
            <Button onClick={() => setPage(Math.max(page - 1, 1))}>
              <ChevronLeft />
            </Button>
            <Button onClick={() => setPage(page + 1)}>
              <ChevronRight />
            </Button>
            <Button onClick={() => setPage(totalPag)}>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
      {!isLoading &&
        data?.map((p) => {
          const src = p.images[0]?.imageUrl;
          return (
            <div
              key={p.id}
              className="flex gap-5 bg-white rounded-lg overflow-hidden p-2"
            >
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rounded-ss"
                  style={{ width: 100, height: 100 }}
                  src={src}
                  alt={p.name}
                />
              )}

              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2 className="text-[22px] font-semibold">{p.name}</h2>
                <h6 className="text-stone-800 text-[16px]">{p.description}</h6>
                <h3>
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(p.price)}
                </h3>
              </div>
            </div>
          );
        })}
    </div>
  );
}
