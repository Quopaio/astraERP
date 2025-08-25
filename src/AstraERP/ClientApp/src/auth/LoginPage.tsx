"use client";
import { useState, useMemo } from "react";
import { Box, Button, Heading, Input, Text, VStack, Code, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { auth } from "./authStore";

type LoginResponse = {
  token: string;
  user?: { id: string; username: string; roles: string[] };
};

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY ?? "jwt";

/**
 * Compute the correct login endpoint regardless of how api.baseURL is configured.
 * - If baseURL ends with '/api' or '/api/', use 'auth/login' (relative)
 * - Otherwise, prepend '/api/auth/login'
 */
function computeLoginEndpoint(baseURL?: string): string {
  if (!baseURL) return "/api/auth/login";
  const b = baseURL.replace(/\/+$/, "");
  return /\/api$/.test(b) ? "auth/login" : "/api/auth/login";
}

export default function LoginPage() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const baseURL = api.defaults.baseURL ?? "";
  const endpoint = useMemo(() => computeLoginEndpoint(baseURL), [baseURL]);

  async function onLogin() {
    setErr("");
    setBusy(true);
    try {
      const r = await api.post<LoginResponse>(endpoint, { username: u, password: p });
      const { token, user } = r.data;

      // persist token
      localStorage.setItem(TOKEN_KEY, token);

      // set axios default header for this session
      api.defaults.headers.common = api.defaults.headers.common ?? {};
      (api.defaults.headers.common as any).Authorization = `Bearer ${token}`;

      // update your store
      auth.token = token;
      auth.user = user ?? null;

      nav("/dashboard", { replace: true });
    } catch (e: any) {
      // show backend message if present (e.g., { message: "Invalid credentials" })
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Login failed";
      setErr(String(msg));
    } finally {
      setBusy(false);
    }
  }

  // allow pressing Enter to submit
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !busy) onLogin();
  }

  return (
    <Box maxW="sm" mx="auto" mt="20" onKeyDown={onKeyDown}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Sign in</Heading>

        {/* tiny debug box (dev only) */}
        {import.meta.env.DEV && (
          <Stack spacing={1} fontSize="sm" p={2} borderWidth="1px" borderRadius="md" opacity={0.8}>
            <div>
              baseURL: <Code>{baseURL || "(none)"}</Code>
            </div>
            <div>
              endpoint: <Code>{endpoint}</Code>
            </div>
            <div>
              token in LS: <Code>{localStorage.getItem(TOKEN_KEY) ? "yes" : "no"}</Code>
            </div>
          </Stack>
        )}

        <Input
          placeholder="Username"
          value={u}
          onChange={(e) => setU(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <Input
          placeholder="Password"
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          autoComplete="current-password"
        />

        {err && <Text color="red.500">{err}</Text>}

        <Button onClick={onLogin} colorScheme="teal" isLoading={busy} loadingText="Signing in">
          Login
        </Button>
      </VStack>
    </Box>
  );
}
