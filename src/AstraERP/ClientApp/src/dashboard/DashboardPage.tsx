"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Heading,
  Spinner,
  Box,
  Alert,
  AlertIcon,
  Code,
  Stack,
} from "@chakra-ui/react";
import KpiCards from "./widgets/KpiCards";
import TopCustomers from "./widgets/TopCustomers";

type Customer = {
  id: string;
  name: string;
  code?: string | null;
  city?: string | null;
};

type CustomersResponse =
  | { items: Customer[]; total: number; page: number; size: number }
  | Customer[];

type DashboardData = {
  totalCustomers: number;
  distinctCities: number;
  withCodes: number;
  topCustomers: Customer[];
};

function deriveDashboard(res: CustomersResponse): DashboardData {
  const items = Array.isArray(res) ? res : res.items ?? [];
  const total = Array.isArray(res) ? items.length : res.total ?? items.length;
  const distinctCities = new Set(
    items.map((c) => (c.city ?? "").trim()).filter(Boolean)
  ).size;
  const withCodes = items.filter((c) => !!c.code?.trim()).length;
  const topCustomers = [...items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 5);
  return { totalCustomers: total, distinctCities, withCodes, topCustomers };
}

// small util to safely show token bits
const mask = (s?: string | null, head = 8, tail = 6) =>
  !s ? "(none)" : s.length <= head + tail ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;

export default function DashboardPage() {
  // read the token directly so we can display what we *think* we're sending
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const base = api.defaults.baseURL ?? "(no baseURL)";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", 1, 50, token],
    queryFn: async () => {
      const url = "/customers";
      const params = { page: 1, size: 50 as number };
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      try {
        // Log what we're about to do
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log("[Dashboard] GET", `${base}${url}`, { params, headers });
        }

        const res = await api.get<CustomersResponse>(url, { params, headers });

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log("[Dashboard] OK", res.status, res.data);
        }
        return res.data;
      } catch (err: any) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error("[Dashboard] ERR", {
            url: `${base}${url}`,
            status: err?.response?.status,
            data: err?.response?.data,
            message: err?.message,
          });
        }
        throw err;
      }
    },
    refetchInterval: 60_000,
  });

  // top-of-page quick debug (only in dev)
  const Debug = () =>
    import.meta.env.DEV ? (
      <Stack
        spacing={1}
        mb={3}
        p={2}
        borderWidth="1px"
        borderRadius="md"
        fontSize="sm"
        opacity={0.8}
      >
        <div>
          API base: <Code>{base}</Code>
        </div>
        <div>
          Token (masked): <Code>{mask(token)}</Code>
        </div>
        <div>
          Has token header:{' '}
          <Code colorScheme={token ? "green" : "red"}>
            {token ? "yes" : "no"}
          </Code>
        </div>
      </Stack>
    ) : null;

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Dashboard
        </Heading>
        <Debug />
        <Alert status="error">
          <AlertIcon />
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </Alert>
      </Box>
    );
  }

  const metrics = deriveDashboard(data as CustomersResponse);

  return (
    <Box>
      <Heading size="md" mb={4}>
        Dashboard
      </Heading>
      <Debug />
      <KpiCards
        data={{
          totalCustomers: metrics.totalCustomers,
          distinctCities: metrics.distinctCities,
          withCodes: metrics.withCodes,
        }}
      />
      <TopCustomers data={metrics.topCustomers} />

      {/* remove after debugging */}
      {import.meta.env.DEV && (
        <pre style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </Box>
  );
}
