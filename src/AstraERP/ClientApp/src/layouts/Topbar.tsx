import { Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { auth } from "@/auth/authStore";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();
  return (
    <Flex p={3} borderBottomWidth="1px" align="center">
      <Heading size="md">AstraERP</Heading>
      <Spacer />
      <Button variant="ghost" onClick={() => { auth.logout(); nav("/login"); }}>Logout</Button>
    </Flex>
  );
}
