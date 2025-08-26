// features/dashboard/useCustomers.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Customer = { id: string; name: string; code?: string | null; city?: string | null };
type CustomersResponse =
  | { items: Customer[]; total: number; page: number; size: number }
  | Customer[];

export function useCustomers(page = 1, size = 50) {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  return useQuery({
    queryKey: ["customers", { page, size }],
    enabled: !!token, // wait until authed
    queryFn: async () => {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get<CustomersResponse>("/customers", { params: { page, size }, headers });
      const data = res.data;

      const items: Customer[] = Array.isArray(data) ? data : data.items ?? [];
      const total = Array.isArray(data) ? items.length : data.total ?? items.length;

      return { items, total };
    },
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
