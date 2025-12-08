"use client";

import { User } from "@/types";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (!token || !localUser) {
      router.push("/sign-in");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthenticated(JSON.parse(localUser));
  }, [router]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              L
            </div>
            <span>Loja Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Olá, {authenticated?.name ?? "Cliente"}
            </span>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t bg-white py-5">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2025 Loja Online. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PrivateRoute;
