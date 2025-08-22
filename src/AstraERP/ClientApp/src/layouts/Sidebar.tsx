import { VStack, Link as CLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();
  const Item = ({ to, children }: any) => (
    <CLink as={Link} to={to} fontWeight={pathname===to?"bold":"normal"}>{children}</CLink>
  );
  return (
    <VStack align="stretch" p={4} borderRightWidth="1px" minW="220px" spacing={3}>
      <Item to="/dashboard">Dashboard</Item>
      <Item to="/customers">Customers</Item>
    </VStack>
  );
}
