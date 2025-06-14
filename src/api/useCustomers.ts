import { useQuery } from "@tanstack/react-query";
import { api } from "./invoices";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export function useCustomers() {
  return useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => (await api.get("/customers")).data,
    staleTime: 10000,
  });
}
