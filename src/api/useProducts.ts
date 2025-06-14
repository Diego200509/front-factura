import { useQuery } from "@tanstack/react-query";
import { api } from "./invoices";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data,
    staleTime: 10000,
  });
}
