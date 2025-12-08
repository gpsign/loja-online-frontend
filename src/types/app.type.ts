/* eslint-disable @typescript-eslint/no-explicit-any */
export type Any = any;

export type User = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "seller";
};
