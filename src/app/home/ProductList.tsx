"use client";
import { useApi } from "@/hooks/useApi";
import { ProductWithImages } from "@/types";
import { useState } from "react";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useApi<ProductWithImages[]>({
    url: "/products",
    queryKey: ["products", String(page)],
    payload: {
      page,
    },
  });
  if (isLoading) {
    return <>loading</>;
  }

  return (
    <div>
      <button onClick={() => setPage(page + 1)}>PROXIMA</button>
      {data?.map((p) => {
        const src = p.images[0]?.imageUrl;
        return (
          <div key={p.id} style={{ display: "flex" }}>
            {src && (
              <img style={{ width: 100, height: 100 }} src={src} alt="" />
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>{p.name}</div>
              <div>{p.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
