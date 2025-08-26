import {
  Grid, GridItem, Drawer, DrawerContent, useDisclosure, Box
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const mobileNav = useDisclosure();         // for Drawer on mobile
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  return (
    <Grid
      h="100vh"
      templateAreas={{
        base: `"topbar" "content"`,
        md:   `"topbar topbar" "sidebar content"`,
      }}
      gridTemplateRows={{ base: "56px 1fr", md: "56px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: collapsed ? "72px 1fr" : "240px 1fr" }}
      bg="gray.50"
    >
      <GridItem area="topbar" bg="white" borderBottom="1px" borderColor="gray.200" zIndex={10}>
        <Topbar
          onOpenMobileSidebar={mobileNav.onOpen}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed(c => !c)}
        />
      </GridItem>

      {/* Desktop sidebar */}
      <GridItem
        area="sidebar"
        display={{ base: "none", md: "block" }}
        bg="gray.50"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
      >
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(c => !c)} />
      </GridItem>

      {/* Mobile drawer sidebar */}
      <Drawer isOpen={mobileNav.isOpen} placement="left" onClose={mobileNav.onClose} autoFocus={false} returnFocusOnClose={false}>
        <DrawerContent>
          <Box h="56px" borderBottom="1px" borderColor="gray.200" />
          <Sidebar collapsed={false} onToggleCollapsed={() => {}} onNavigate={mobileNav.onClose} />
        </DrawerContent>
      </Drawer>

      <GridItem area="content" bg="white" overflow="auto" p={4}>
        <Outlet />
      </GridItem>
    </Grid>
  );
}
