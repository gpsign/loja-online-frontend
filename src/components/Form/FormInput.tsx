"use client";

import { useEffect } from "react";
import { useFormContext } from "./FormContext";
import { Input } from "../ui/input";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string;
  label?: string;
  requiredMarking?: boolean;
}

export function FormInput({
  field,
  label,
  required,
  className,
  requiredMarking,
  ...props
}: FormInputProps) {
  const { values, errors, setFieldValue, registerField, unregisterField } =
    useFormContext();

  const errorMessage = errors[field];
  const hasError = !!errorMessage;

  useEffect(() => {
    registerField(field, (value) => {
      if (required && !value) {
        return "Este campo é obrigatório";
      }
      return null;
    });

    return () => unregisterField(field);
  }, [field, required, registerField, unregisterField]);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{" "}
          {required && requiredMarking != false && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}

      <Input
        name={field}
        value={values[field] || ""}
        onChange={(e) => setFieldValue(field, e.target.value)}
        className={`
          ${hasError ? "border-red-500 focus:ring-2 focus:ring-red-200" : ""}
          ${className || ""}
        `}
        {...props}
      />

      {hasError && errorMessage && (
        <span className="text-xs text-red-500 font-semibold animate-pulse">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
