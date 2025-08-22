// src/app/page.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Heading, Spinner } from "@chakra-ui/react";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => axios.get("http://localhost:5000/api/customers").then(res => res.data)
  });

  if (isLoading) return <Spinner />;

  return (
    <Box p={8}>
      <Heading>MixERP React Dashboard</Heading>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
