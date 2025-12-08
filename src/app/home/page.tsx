"use client";
import PrivateRoute from "@/components/PrivateRouter";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <PrivateRoute>
      <main className="m-auto w-[50%] max-h-[80dvh] overflow-auto p-5 rounded-xl">
        <ProductList />
      </main>
    </PrivateRoute>
  );
}
