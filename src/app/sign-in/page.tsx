"use client";

import { AuthCard } from "@/components/AuthCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { AppError } from "@/lib/api-client";
import { LoginFormValues, loginSchema } from "@/schemas";
import { Any } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { request: submit, isLoading } = useApi({
    url: "/sign-in",
    method: "POST",
  });

  function onSubmit(data: LoginFormValues) {
    form.clearErrors();

    submit(data, {
      onSuccess(data) {
        const { user, token } = data as Any;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        router.push("/home");
      },
      onError: (error) => {
        if (error instanceof AppError) {
          if (error.code !== "invalid_credentials") return;
          form.setError("root", { message: "Email ou senha inválidos" });
          form.setError("email", {
            type: "manual",
            message: "",
          });
          form.setError("password", {
            type: "manual",
            message: "",
          });
        }
      },
    });
  }

  const rootErrorMessage = form.formState.errors.root?.message ?? "";

  return (
    <AuthCard
      title="Acesse sua conta"
      footerText="Não tem uma conta?"
      footerLinkText="Cadastre-se"
      footerLinkHref="/sign-up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {rootErrorMessage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                exit={{ height: 0, opacity: 0 }}
                animate={{ height: "fit-content", opacity: 1 }}
                className="overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{rootErrorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <Button disabled={isLoading} type="submit" className="w-full ">
            {isLoading ? "Entrando" : "Entrar"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
