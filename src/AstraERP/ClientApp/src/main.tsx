// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Providers from "./app/providers";


const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>

      <Providers>
        <App />
      </Providers>

  </React.StrictMode>
);
