import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./config/queryClient";
import "./languages/i18n";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);
