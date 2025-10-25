import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    __APP_BOOTSTRAPPED__?: boolean;
    __onAppBootstrapped?: () => void;
    __APP_BOOTSTRAP_FALLBACK__?: {
      show?: (reason: string, detail?: string) => void;
      clear?: () => void;
    };
  }
}

const mount = document.getElementById("root");

if (mount) {
  createRoot(mount).render(<App />);
  window.__APP_BOOTSTRAPPED__ = true;
  window.__onAppBootstrapped?.();
} else {
  console.error("[Vista Pension] Failed to find root element for mounting.");
  window.__APP_BOOTSTRAPPED__ = false;
  window.__APP_BOOTSTRAP_FALLBACK__?.show?.("missing-root", "Element #root not found.");
}
