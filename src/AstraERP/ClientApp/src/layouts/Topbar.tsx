import {
  Flex, IconButton, HStack, Text, Spacer, useColorMode, Button
} from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { auth } from "@/auth/authStore";
import { useNavigate } from "react-router-dom";

export default function Topbar({
  onOpenMobileSidebar,
  collapsed,
  onToggleCollapsed,
}: {
  onOpenMobileSidebar: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Flex align="center" h="56px" px={3} gap={2}>
      {/* Mobile menu button */}
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpenMobileSidebar}
        variant="ghost"
      />

      {/* Desktop collapse toggle */}
      <IconButton
        aria-label="Toggle sidebar"
        icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        display={{ base: "none", md: "inline-flex" }}
        onClick={onToggleCollapsed}
        variant="ghost"
      />

      <Text fontWeight="bold">My App</Text>
      <Spacer />

      <HStack spacing={2}>
        <Button size="sm" variant="ghost" onClick={toggleColorMode}>
          {colorMode === "light" ? "Dark" : "Light"}
        </Button>
        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
