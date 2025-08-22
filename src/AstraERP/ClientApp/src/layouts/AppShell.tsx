import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minH="100vh">
      <Topbar />
      <Flex flex="1">
        <Sidebar />
        <Box p={6} flex="1">{children}</Box>
      </Flex>
    </Flex>
  );
}
