"use client";
import AlertButton from "@/components/AlertButton";
import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useApi } from "@/hooks/useApi";
import {
  Any,
  DashboardChartData,
  DashboardData,
  FavoriteItem,
  ProductWithImages,
  User,
} from "@/types";
import { formatCurrency } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { startOfDay, subDays } from "date-fns";

import {
  Award,
  CircleUserIcon,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  SquareStarIcon,
  Trash2Icon,
  TrendingUp,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

export default function ProfilePage() {
  return (
    <Page>
      <Profile />
    </Page>
  );
}

function Profile() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "overview"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const user = usePrivateContext().user;
  const isSeller = user.role === "seller";
  const router = useRouter();
  const tabs = [
    ...(isSeller
      ? [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }]
      : []),
    ...(isSeller
      ? [{ id: "products", label: "Meus Produtos", icon: Package }]
      : []),
    { id: "favorites", label: "Favoritos", icon: Heart },
  ];

  if (!isSeller && activeTab === "overview") setActiveTab("favorites");

  const { data: favorites, isLoading: isLoadingFavorites } = useApi<
    FavoriteItem[]
  >({
    url: "/favorites",
  });

  const queryClient = useQueryClient();

  const { data: myProducts } = useApi<ProductWithImages[]>({
    url: "/user/" + user.id + "/products",
  });

  const { request: updateStatus } = useApi<ProductWithImages[]>({
    url: "/user/" + user.id + "/status",
    method: "PATCH",
  });

  const [status, setStatus] = useState(user.status);

  const isInactive = isSeller && status === "inactive";
  const isActive = isSeller && status === "active";

  const switchStatus = (newStatus: User["status"]) => {
    const newUser = { ...user, status: newStatus };
    localStorage.setItem("user", JSON.stringify(newUser));
    queryClient.invalidateQueries();
    setStatus(newStatus);
  };

  return (
    <>
      <PageTitle
        title="Meu Perfil"
        icon={<UserIcon className="h-8 w-8 text-gray-900" />}
      >
        {isActive && (
          <AlertButton
            className="ml-auto bg-red-100 hover:bg-red-200 text-red-900"
            alertDescription="Desativar sua conta também irá desativar todos os seus produtos!"
            onAction={() => {
              updateStatus(
                { status: "inactive" },
                {
                  onSuccess: () => {
                    toast.success("Conta desativada com sucesso", {
                      richColors: true,
                      position: "top-right",
                    });
                    switchStatus("inactive");
                  },
                }
              );
            }}
          >
            <Trash2Icon /> Desativar sua conta
          </AlertButton>
        )}
        {isInactive && (
          <AlertButton
            className="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-900"
            alertDescription="Sua conta será reativada"
            onAction={() => {
              updateStatus(
                { status: "active" },
                {
                  onSuccess: () => {
                    toast.success("Conta ativada com sucesso", {
                      richColors: true,
                      position: "top-right",
                    });

                    switchStatus("active");
                  },
                }
              );
            }}
          >
            <UserCheckIcon /> Ativar sua conta
          </AlertButton>
        )}
      </PageTitle>
      <section className="bg-white rounded-2xl p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg flex items-center justify-center">
            {/* Queria ter colocado imagens de usuários :( */}
            <CircleUserIcon className="w-30 h-30" />
          </div>
          <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-2 py-1 rounded-full border-2 border-white font-bold uppercase tracking-wider">
            {user.role === "seller" ? "Vendedor" : "Cliente"}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-500 mb-6 flex items-center justify-center md:justify-start gap-2">
            <span>{user.email}</span>
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/sign-in");
              }}
              className="bg-white text-black border shadow-sm hover:bg-red-100 hover:text-red-900"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>

        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">
              {isLoadingFavorites ? "-" : favorites?.length ?? 0}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Favoritos
            </span>
          </div>
          {isSeller && (
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {myProducts?.length}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Produtos
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Any)}
              className={`flex items-center gap-2 pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive ? "text-black" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "overview" && isSeller && <OverviewGraph />}
        {activeTab === "products" && isSeller && (
          <div>
            <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Gerenciar Inventário
              </h2>
              <Button onClick={() => router.push("/product/new")}>
                <Plus size={16} /> Novo Produto
              </Button>
            </div>

            {Number(myProducts?.length) > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-xl ">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">
                  Você ainda não cadastrou nenhum produto.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ABA: FAVORITOS (Todos) */}
        {activeTab === "favorites" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Seus produtos favoritados
              </h2>
              <p className="text-gray-500 text-sm">Produtos que você amou</p>
            </div>

            {Number(favorites?.length) > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites?.map(({ product }) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-xl ">
                <Heart className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">
                  Sua lista de favoritos está vazia.
                </p>
                <Button
                  onClick={() => router.push("/home")}
                  className="mt-4 hover:underline"
                >
                  Ir às compras
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function inverseSize(text: string, minSize: number, maxSize: number) {
  const length = text?.length ?? 0;
  if (length === 0) return maxSize;
  const raw = maxSize / (1 + length * 0.015);
  return Math.max(minSize, Math.min(maxSize, raw));
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: Any;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <Icon size={24} className="text-gray-900" />
    </div>

    <h3
      style={{ fontSize: inverseSize(String(value), 12, 24) }}
      className="text-2xl block font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
    >
      {value}
    </h3>
  </div>
);

function OverviewGraph() {
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>();

  const { data } = useApi<DashboardData>({
    url: "/dashboard",
    queryKey: ["dashboard" + startDate],
    payload: { startDate },
  });

  const items = data?.chart ?? [];

  function sum(key: keyof DashboardChartData): number {
    return items?.reduce((prev, item) => prev + Number(item[key]), 0) ?? 0;
  }
  const receitaTotal = sum("revenue");

  const vendasRealizadas = sum("salesCount");
  const favoritados = sum("favorites");
  const carrinho = sum("inCarts");

  const applyDate = (days: string) => {
    setDate(days);
    const past = startOfDay(subDays(new Date(), Number(days))).toString();
    setStartDate(past.toString());
  };

  const bestSeller = data?.bestSeller?.name ?? "--";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Visão Geral de Vendas
          </h2>
          <p className="text-gray-500 text-sm mb-2.5">
            Acompanhe o desempenho da sua loja nos últimos {date} dias.
          </p>
        </div>
        <ToggleGroup
          className="bg-white border shadow-sm divide-x"
          type="single"
          value={date}
          onValueChange={applyDate}
        >
          <ToggleGroupItem value="7">7 dias</ToggleGroupItem>
          <ToggleGroupItem value="30">30 dias</ToggleGroupItem>
          <ToggleGroupItem value="90">3 meses</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(receitaTotal)}
          icon={TrendingUp}
        />
        <MetricCard
          title="Vendas Realizadas"
          value={String(vendasRealizadas)}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Novos Favoritos"
          value={favoritados}
          icon={SquareStarIcon}
        />
        <MetricCard title="No Carrinho" value={carrinho} icon={Package} />
        <MetricCard title="Mais Vendido" value={bestSeller} icon={Award} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Desempenho Diário</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={items ?? []}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-bold text-muted-foreground">
                            Receita:
                          </span>
                          <span className="font-bold">
                            R$ {payload[0].value}
                          </span>
                          <span className="text-muted-foreground">Vendas:</span>
                          <span>{payload[0].payload.salesCount}</span>
                          <span className="text-muted-foreground">
                            Favoritos:
                          </span>
                          <span>{payload[0].payload.favorites}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-emerald-500"
              />
              <Bar
                dataKey="salesCount"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-blue-500"
              />
              <Bar
                dataKey="favorites"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-yellow-500"
              />
              <Bar
                dataKey="inCart"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-amber-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
