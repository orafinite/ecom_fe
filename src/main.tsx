import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import RouteProvider from "@/middleware";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/providers/theme-provider.tsx";
import { Toaster } from "sonner";
import { Spinner } from "./components/ui/spinner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <RouteProvider>
          <Toaster
            toastOptions={{
              style: {
                height: "50px",
                padding: "10px",
              },
            }}
            icons={{ loading: <Spinner /> }}
            invert={true}
            theme="system"
            position="top-right"
          />
          <App />
        </RouteProvider>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
