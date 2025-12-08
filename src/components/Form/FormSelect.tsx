"use client";

import { useEffect } from "react";
import { useFormContext } from "./FormContext";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps
  extends React.ComponentProps<typeof SelectPrimitive.Root> {
  field: string;
  label?: string;
  placeholder?: string;
  items: Option[];
  required?: boolean;
  requiredMarking?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormSelect({
  field,
  label,
  placeholder,
  items,
  required,
  requiredMarking,
  className,
  disabled,
  ...props
}: FormSelectProps) {
  const { values, errors, setFieldValue, registerField, unregisterField } =
    useFormContext();

  const errorMessage = errors[field];
  const hasError = !!errorMessage;
  const currentValue = values[field];

  useEffect(() => {
    registerField(field, (value) => {
      if (required && !value) {
        return "Selecione uma opção";
      }
      return null;
    });

    return () => unregisterField(field);
  }, [field, required, registerField, unregisterField]);

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{" "}
          {required && requiredMarking != false && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}

      <Select
        disabled={disabled}
        value={currentValue || ""}
        onValueChange={(val) => setFieldValue(field, val)}
        required={required}
        {...props}
      >
        <SelectTrigger
          className={`
            transition-all w-full
            ${
              hasError
                ? "border-red-500 focus:ring-red-200 ring-offset-0 focus:ring-2"
                : ""
            }
          `}
        >
          <SelectValue placeholder={placeholder || "Selecione..."} />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <span className="text-xs text-red-500 font-semibold animate-pulse">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
