import { Any } from "@/types";
import { createContext, useContext } from "react";

type FormContextType = {
  values: Record<string, Any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  setFieldValue: (field: string, value: Any) => void;
  registerField: (
    field: string,
    validate?: (value: Any) => string | null
  ) => void;
  unregisterField: (field: string) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error("FormInput deve ser usado dentro de um Form");
  return context;
}

export default FormContext;
