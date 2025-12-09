"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

interface PageTitleProps extends React.PropsWithChildren {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  goBack?: boolean;
}

export default function PageTitle({
  title,
  subtitle,
  icon,
  children,
  goBack,
}: PageTitleProps) {
  const router = useRouter();
  const renderGoBack = window.location.pathname != "/home" && goBack != false;

  return (
    <div className="mb-8 flex items-baseline-last justify-between">
      <div>
        {renderGoBack && (
          <div className="flex gap-2 mb-1 -mt-8">
            <Button
              onClick={() => router.back()}
              className="bg-transparent text-black hover:bg-zinc-900 hover:text-white w-[32px] h-[32px]"
            >
              <ArrowLeft />
            </Button>
            <span className="flex items-center gap-2 text-[20px] select-none">
              Voltar
            </span>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex gap-2 items-center">
          {icon}
          <span>{title}</span>
        </h1>
        <p className="mt-2 text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
