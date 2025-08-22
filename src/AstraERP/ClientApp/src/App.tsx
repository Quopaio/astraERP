import Providers from "./app/providers";
import { Box, Heading, Button } from "@chakra-ui/react";
import AppRouter from "./app/router";

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
