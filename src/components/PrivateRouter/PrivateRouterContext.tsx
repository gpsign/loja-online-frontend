import { User } from "@/types";
import { createContext, useContext } from "react";

type PrivateRouteContextType = {
  user: User;
};

const PrivateRouteContext = createContext<PrivateRouteContextType | null>(null);

export function usePrivateContext() {
  const context = useContext(PrivateRouteContext);
  if (!context) throw new Error("Sem permissão");
  return context;
}

export default PrivateRouteContext;
