import Providers from "./app/providers";
import { Box, Heading, Button } from "@chakra-ui/react";


export default function App() {
  return (
    <Providers>
      <div style={{ padding: 16 }}>Customers module coming soon…</div>
            <Button colorScheme="teal">Chakra Site</Button>
    </Providers>
  );
}
