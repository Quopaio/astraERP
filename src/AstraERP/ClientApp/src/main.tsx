import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Providers from "./app/providers";
import { loadPluginsFromManifest } from "./plugin/registry/pluginRegistry";

(async () => {
  // Try to hydrate plugin registry; safe if /api/plugins/manifest returns []
  try {
    await loadPluginsFromManifest();
  } catch {
    // First boot or API not ready — ignore quietly
  }

  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Root element #root not found");

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );
})();
