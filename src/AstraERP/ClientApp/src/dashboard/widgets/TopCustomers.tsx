import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

export default function TopCustomers({ data }: { data: any[] }) {
  return (
    <Table size="sm" mt={6}>
      <Thead><Tr><Th>Customer</Th><Th isNumeric>Total</Th></Tr></Thead>
      <Tbody>
        {(data ?? []).map((c, i) => (
          <Tr key={i}><Td>{c.name}</Td><Td isNumeric>${(c.total ?? 0).toLocaleString()}</Td></Tr>
        ))}
      </Tbody>
    </Table>
  );
}
