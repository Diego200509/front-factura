// src/api/useInvoices.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "./invoices";
import type { Invoice } from "./types";

export function useInvoices(
  page: number,
  pageSize: number,
  customerName: string
) {
  const key = ["invoices", page, pageSize, customerName] as const;

  const fetchInvoices = async (): Promise<Invoice[]> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(customerName ? { customerName } : {}),
    });
    const res = await api.get<Invoice[]>(`/invoices?${params}`);
    return res.data;
  };

  return useQuery<Invoice[], Error>({
    queryKey: key,
    queryFn: fetchInvoices,
    staleTime: 5_000,
  });
}
