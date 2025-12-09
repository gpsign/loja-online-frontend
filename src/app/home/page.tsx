"use client";
import Page from "@/components/Page";
import PageTitle from "@/components/Page/PageHeader";
import { usePrivateContext } from "@/components/PrivateRouter/PrivateRouterContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <Page>
      <PageTitle title="Nossos produtos" subtitle="Explore">
        <NewProductButton />
      </PageTitle>
      <ProductList />
    </Page>
  );
}

function NewProductButton() {
  const router = useRouter();
  const user = usePrivateContext().user;
  const isSeller = user.role == "seller";

  if (!isSeller) return null;
  return (
    <Button
      onClick={() => {
        router.push("/product/new");
      }}
    >
      Adicionar produto
    </Button>
  );
}
