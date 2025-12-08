import { httpClient } from "@/lib/api-client";
import { Any } from "@/types";
import {
  QueryKey,
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Tipagem base das Props
interface UseApiBaseProps<TData, TVariables> {
  url: string;
  queryKey?: QueryKey;
  payload?: TVariables;
  queryOptions?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">;
  mutationOptions?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn"
  >;
}

export function useApi<TData = unknown, MData = unknown>(
  props: UseApiBaseProps<TData, unknown> & { method?: "GET" }
): {
  data: TData | undefined;
  meta: MData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  status: "error" | "success" | "pending";
  request: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<TData, Error>>;
};

export function useApi<TData = unknown, MData = unknown, TVariables = unknown>(
  props: UseApiBaseProps<TData, TVariables> & {
    method: "POST" | "PUT" | "DELETE" | "PATCH";
  }
): {
  data: TData | undefined;
  meta: MData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  status: "error" | "success" | "pending" | "idle";
  request: (variables: TVariables) => void;
  requestAsync: (variables: TVariables) => Promise<TData>;
};

export function useApi<TData = unknown, TVariables = unknown>({
  url,
  method = "GET",
  queryKey,
  payload,
  queryOptions,
  mutationOptions,
}: UseApiBaseProps<TData, TVariables> & { method?: HttpMethod }) {
  const isGet = method === "GET";

  // --- LÓGICA DO GET ---
  const query = useQuery<TData, Error>({
    queryKey: queryKey || [url],
    queryFn: () =>
      httpClient<TData>(url, { params: payload as Any, method: "GET" }),
    enabled: isGet && (queryOptions?.enabled ?? true),
    ...queryOptions,
  });

  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => {
      const finalBody = variables || payload;
      return httpClient<TData>(url, { method, body: finalBody as Any });
    },
    ...mutationOptions,
  });

  if (isGet) {
    return {
      ...query,
      data: (query.data as Any)?.data ?? (query.data as Any),
      meta: (query.data as Any)?.meta,
    };
  }

  return {
    ...mutation,
    isLoading: mutation.isPending,
    request: mutation.mutate,
    requestAsync: mutation.mutateAsync,
  } as Any;
}
