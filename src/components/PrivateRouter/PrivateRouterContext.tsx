import { User } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createContext, useContext } from "react";

type PrivateRouteContextType = {
  router: AppRouterInstance;
  user: User;
};

const PrivateRouteContext = createContext<PrivateRouteContextType | null>(null);

export function usePrivateContext() {
  const context = useContext(PrivateRouteContext);
  if (!context) throw new Error("Sem permissão");
  return context;
}

export default PrivateRouteContext;
