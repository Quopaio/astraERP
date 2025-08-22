"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Heading, Spinner, Box } from "@chakra-ui/react";
import KpiCards from "./widgets/KpiCards";
import TopCustomers from "./widgets/TopCustomers";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/dashboard/metrics")).data,
    refetchInterval: 60_000, // refresh every minute
  });

  if (isLoading) return <Spinner />;

  return (
    <Box>
      <Heading size="md" mb={4}>Dashboard</Heading>
      <KpiCards data={data} />
      <TopCustomers data={data?.topCustomers ?? []} />
    </Box>
  );
}
