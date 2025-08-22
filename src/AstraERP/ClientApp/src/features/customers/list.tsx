"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Heading, Spinner, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

export default function CustomersList() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => (await api.get("/customers?page=1&size=25")).data
  });
  if (isLoading) return <Spinner />;
  const rows = Array.isArray(data) ? data : (data?.items ?? []);
  return (
    <>
      <Heading size="md" mb={4}>Customers</Heading>
      <Table size="sm">
        <Thead><Tr><Th>Name</Th><Th>Code</Th><Th>City</Th></Tr></Thead>
        <Tbody>
          {rows.map((c: any) => <Tr key={c.id}><Td>{c.name}</Td><Td>{c.code}</Td><Td>{c.city}</Td></Tr>)}
        </Tbody>
      </Table>
    </>
  );
}
