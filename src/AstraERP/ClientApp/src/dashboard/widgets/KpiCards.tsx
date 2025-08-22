import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Box } from "@chakra-ui/react";

export default function KpiCards({ data }: { data: any }) {
  const { salesToday, ordersOpen, customersTotal, inventoryLow } = data || {};
  return (
    <SimpleGrid columns={[1,2,4]} gap={4}>
      <Box borderWidth="1px" borderRadius="md" p={4}><Stat><StatLabel>Sales Today</StatLabel><StatNumber>${(salesToday ?? 0).toLocaleString()}</StatNumber><StatHelpText>vs yesterday</StatHelpText></Stat></Box>
      <Box borderWidth="1px" borderRadius="md" p={4}><Stat><StatLabel>Open Orders</StatLabel><StatNumber>{ordersOpen ?? 0}</StatNumber></Stat></Box>
      <Box borderWidth="1px" borderRadius="md" p={4}><Stat><StatLabel>Total Customers</StatLabel><StatNumber>{customersTotal ?? 0}</StatNumber></Stat></Box>
      <Box borderWidth="1px" borderRadius="md" p={4}><Stat><StatLabel>Low Inventory</StatLabel><StatNumber>{inventoryLow ?? 0}</StatNumber></Stat></Box>
    </SimpleGrid>
  );
}
