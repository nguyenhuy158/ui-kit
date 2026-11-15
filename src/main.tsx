import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import { Gallery } from "./demo/Gallery";
import { ToastProvider } from "./ui/Toast";
import { ThemeProvider } from "./ui/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <Gallery />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
