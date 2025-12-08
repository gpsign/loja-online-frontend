"use client";
import { Form } from "@/components/Form";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const userRoles = [
    { label: "Cliente", value: "customer" },
    { label: "Vendedor", value: "seller" },
  ];

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Cadastro
      </h1>

      <Form
        submit={{
          url: "/sign-up",
          method: "POST",
          mutationOptions: {
            onSuccess: () => {
              router.push("/sign-in");
            },
          },
        }}
      >
        <FormInput field="name" label="Nome" placeholder="Ex: João" required />
        <FormSelect
          field="role"
          label="Tipo de usuário"
          placeholder="Selecione"
          items={userRoles}
          required
        />
        <FormInput field="email" label="E-mail" placeholder="E-mail" required />
        <FormInput
          field="password"
          type="password"
          label="Senha"
          placeholder="••••••••••"
          required
        />
        <FormInput
          field="confirmPassword"
          type="password"
          label="Confirme sua senha"
          placeholder="••••••••••"
          required
        />
        <span>
          Já possui uma conta?
          <a
            href="/sign-up"
            onClick={(e) => {
              e.preventDefault();
              router.push("/sign-in");
            }}
          >
            Faça login!
          </a>
        </span>
      </Form>
    </div>
  );
}
