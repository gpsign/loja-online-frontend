"use client";
import PrivateRoute from "@/components/PrivateRouter";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <PrivateRoute>
      <main>
        <ProductList />
      </main>
    </PrivateRoute>
  );
}
