"use client";
import PrivateRoute from "@/components/PrivateRouter";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <PrivateRoute>
      <main id="home" className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Nossos Produtos
            </h1>
            <p className="mt-2 text-gray-500">
              Explore nossa coleção
            </p>
          </div>
          <ProductList />
        </div>
      </main>
    </PrivateRoute>
  );
}
