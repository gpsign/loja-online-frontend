"use client";

import { FormEvent, useCallback, useState } from "react";

import { useApi } from "@/hooks/useApi"; // Seu hook criado anteriormente
import { AppError } from "@/lib/api-client";
import { Any } from "@/types";
import { Button } from "../ui/button";
import FormContext from "./FormContext";

interface FormProps {
  children: React.ReactNode;
  submit: {
    url: string;
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    mutationOptions?: {
      onSuccess?: (data: Any) => void;
      onError?: (error: Error) => void;
    };
  };
}

export function Form({ children, submit }: FormProps) {
  const [values, setValues] = useState<Record<string, Any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validators, setValidators] = useState<
    Record<string, (val: Any) => string | null>
  >({});

  const { request, isLoading } = useApi({
    url: submit.url,
    method: submit.method || "POST",
    mutationOptions: {
      ...submit.mutationOptions,
      onError: (err) => {
        const apiError = err as AppError;
        if (apiError.issues && Array.isArray(apiError.issues)) {
          const serverErrors: Record<string, string> = {};

          apiError.issues.forEach(
            ({ field, message }: { field: string; message: string }) => {
              if (field) {
                serverErrors[field] = message;
              }
            }
          );

          setErrors((prev) => ({ ...prev, ...serverErrors }));
        }

        submit.mutationOptions?.onError?.(apiError);
      },
    },
  });

  const setFieldValue = useCallback(
    (field: string, value: Any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const registerField = useCallback(
    (field: string, validate?: (val: Any) => string | null) => {
      if (validate) {
        setValidators((prev) => ({ ...prev, [field]: validate }));
      }
    },
    []
  );

  const unregisterField = useCallback((field: string) => {
    setValidators((prev) => {
      const newValidators = { ...prev };
      delete newValidators[field];
      return newValidators;
    });
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let hasError = false;

    Object.keys(validators).forEach((field) => {
      const errorMsg = validators[field](values[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    request(values);
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        isSubmitting: isLoading,
        setFieldValue,
        registerField,
        unregisterField,
      }}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {children}

        <Button
          type="submit"
          disabled={isLoading}
          // className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </FormContext.Provider>
  );
}
