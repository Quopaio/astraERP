interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_AUTH_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
