// dashboard/DashboardPage.tsx
"use client";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
  Text,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useCustomers } from "./useCustomers";
import KpiCards from "./widgets/KpiCards";
import TopCustomers from "./widgets/TopCustomers";

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useCustomers(1, 50);

  // derived
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const distinctCities = new Set(items.map(c => (c.city ?? "").trim()).filter(Boolean)).size;
  const withCodes = items.filter(c => !!c.code?.trim()).length;
  const topCustomers = [...items].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 5);

  // Loading
  if (isLoading) {
    return (
      <Box>
        <Heading size="md" mb={4}>Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
          <Skeleton height="96px" />
          <Skeleton height="96px" />
          <Skeleton height="96px" />
        </SimpleGrid>
        <Skeleton height="260px" />
      </Box>
    );
  }

  // Error
  if (isError) {
    return (
      <Box>
        <Heading size="md" mb={4}>Dashboard</Heading>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </Alert>
        <Button onClick={() => refetch()} colorScheme="blue">Retry</Button>
      </Box>
    );
  }

  // Empty
  if (!items.length) {
    return (
      <Box>
        <Heading size="md" mb={2}>Dashboard</Heading>
        <Card>
          <CardBody>
            <Stack spacing={2}>
              <Text>No customers yet.</Text>
              <Text color="gray.600">Add some customers to see KPIs and rankings.</Text>
              <Button onClick={() => refetch()} alignSelf="start" variant="outline">Refresh</Button>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  // Happy path
  return (
    <Box>
      <Heading size="md" mb={4}>Dashboard</Heading>

      <KpiCards data={{ totalCustomers: total, distinctCities, withCodes }} />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} mt={4}>
        <Card>
          <CardHeader pb={0}><Heading size="sm">Top Customers</Heading></CardHeader>
          <CardBody>
            <TopCustomers data={topCustomers} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader pb={0}><Heading size="sm">Summary</Heading></CardHeader>
          <CardBody>
            <Stack spacing={1} color="gray.700">
              <Text>Total customers: <b>{total}</b></Text>
              <Text>Cities represented: <b>{distinctCities}</b></Text>
              <Text>With codes: <b>{withCodes}</b></Text>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
