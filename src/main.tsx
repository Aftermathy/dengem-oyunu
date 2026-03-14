import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// One-time full reset: clear all game data for fresh start
const RESET_FLAG = 'ims_full_reset_v2';
if (!localStorage.getItem(RESET_FLAG)) {
  localStorage.clear();
  localStorage.setItem(RESET_FLAG, 'done');
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
