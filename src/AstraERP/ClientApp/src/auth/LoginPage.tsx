"use client";
import { useState } from "react";
import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { auth } from "./authStore";

export default function LoginPage() {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onLogin() {
    setErr("");
    try {
      const r = await api.post("/auth/login", { username: u, password: p });
      const { token, user } = r.data;             // { token: "...", user: { id, username, roles } }
      auth.token = token; auth.user = user || null;
      nav("/dashboard", { replace: true });
    } catch {
      setErr("Invalid credentials");
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt="20">
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Sign in</Heading>
        <Input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} />
        <Input placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)} />
        {err && <Text color="red.500">{err}</Text>}
        <Button onClick={onLogin} colorScheme="teal">Login</Button>
      </VStack>
    </Box>
  );
}
