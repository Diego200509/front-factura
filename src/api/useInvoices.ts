// src/api/useInvoices.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "./invoices";
import type { Invoice } from "./types";

export function useInvoices() {
  return useQuery<Invoice[], Error>({
    // 1) queryKey
    queryKey: ["invoices"],
    // 2) queryFn
    queryFn: async () => {
      const response = await api.get<Invoice[]>("/invoices");
      return response.data;
    },
  });
}
