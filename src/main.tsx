import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import { Gallery } from "./demo/Gallery";
import { ConfirmProvider } from "./ui/ConfirmProvider";
import { ToastProvider } from "./ui/Toast";
import { ThemeProvider } from "./ui/theme";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Gallery />
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
