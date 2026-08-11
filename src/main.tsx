import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import { ThemeProvider } from "./ui/theme";
import { ToastProvider } from "./ui/Toast";
import { Gallery } from "./demo/Gallery";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <Gallery />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
