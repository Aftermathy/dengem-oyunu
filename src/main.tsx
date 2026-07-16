import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { initPurchases } from "./lib/purchases.ts";
import { initAds } from "./hooks/useAds.ts";
import "./index.css";

initPurchases();
void initAds();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
