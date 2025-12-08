import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductHeader() {
  const router = usePrivateContext().router;

  return (
    <div className="w-full flex items-center mb-6 gap-2 px-6">
      <Button
        onClick={() => router.push("/home")}
        className="bg-transparent text-black hover:bg-zinc-900 hover:text-white w-[32px] h-[32px] cursor-pointer"
      >
        <ArrowLeft />
      </Button>
      <span className="flex items-center gap-2 text-[20px] select-none">
        Voltar
      </span>
    </div>
  );
}
