import {
  Box, VStack, Text, Tooltip, Icon, Button, Divider
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FiHome, FiGrid, FiUsers, FiSpeaker, FiChevronLeft, FiChevronRight } from "react-icons/fi";

type NavItem = { to: string; label: string; icon: any; end?: boolean };

const nav: NavItem[] = [
  { to: "/",          label: "Home",      icon: FiHome,  end: true },
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/customers", label: "Customers", icon: FiUsers },
  { to: "/test",      label: "Test",      icon: FiSpeaker },
];

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void; // used by mobile Drawer to close on click
}) {
  return (
    <Box h="100%" p={2}>
      <VStack align="stretch" spacing={1}>
        <Button
          onClick={onToggleCollapsed}
          size="sm"
          variant="ghost"
          leftIcon={<Icon as={collapsed ? FiChevronRight : FiChevronLeft} />}
          display={{ base: "none", md: "inline-flex" }}
          justifyContent={collapsed ? "center" : "flex-start"}
        >
          {!collapsed && "Collapse"}
        </Button>

        <Divider my={2} />

        {nav.map(item => {
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={2}
                  borderRadius="md"
                  bg={isActive ? "purple.50" : "transparent"}
                  color={isActive ? "purple.700" : "gray.800"}
                  _hover={{ bg: "gray.100" }}
                  transition="background 0.15s ease"
                >
                  <Icon as={item.icon} boxSize={5} />
                  {!collapsed && <Text fontWeight={isActive ? "semibold" : "medium"}>{item.label}</Text>}
                </Box>
              )}
            </NavLink>
          );

          // Show tooltips for icons when collapsed
          return collapsed ? (
            <Tooltip key={item.to} label={item.label} placement="right">
              <Box>{link}</Box>
            </Tooltip>
          ) : (
            <Box key={item.to}>{link}</Box>
          );
        })}
      </VStack>
    </Box>
  );
}
