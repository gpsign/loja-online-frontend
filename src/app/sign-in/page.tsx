"use client";
import { Form } from "@/components/Form";
import { FormInput } from "@/components/Form/FormInput";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login
      </h1>

      <Form
        submit={{
          url: "/sign-in",
          method: "POST",
          mutationOptions: {
            onSuccess: (data) => {
              localStorage.setItem("token", data.token);
              router.push("/home");
            },
          },
        }}
      >
        <FormInput field="email" label="E-mail" placeholder="E-mail" required />
        <FormInput
          field="password"
          type="password"
          label="Senha"
          placeholder="••••••••••"
          required
        />
        <span>
          Não possui uma conta?
          <a
            href="/sign-up"
            onClick={(e) => {
              e.preventDefault();
              router.push("/sign-up");
            }}
          >
            Cadastre-se!
          </a>
        </span>
      </Form>
    </div>
  );
}
