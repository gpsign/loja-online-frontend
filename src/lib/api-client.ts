"use client";
import { Any } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  body?: Any;
  params?: Record<string, string | number | boolean>;
};

const actions: Record<string, VoidFunction> = {
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    localStorage.setItem("expired", "true");

    window.location.href = "/sign-in";
  },
};

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly issues?: { field: string; message: string }[];

  constructor(
    message: string,
    status: number = 400,
    code: string = "app_error",
    data?: Any
  ) {
    super(message);
    this.status = status;
    this.isOperational = true;
    this.code = code;

    if (data) {
      this.issues = data.issues;
    }
  }
}

export async function httpClient<T>(
  endpoint: string,
  { body, params, ...customConfig }: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customConfig.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let url = `${BASE_URL}/${
    endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  }`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const action = actions[errorData.action ?? ""];

    if (action) {
      action();
    }

    throw new AppError(
      errorData?.message || `Erro: ${response.statusText}`,
      response.status,
      errorData.code,
      errorData
    );
  }

  if (response.status === 204) return {} as T;
  return response.json();
}
