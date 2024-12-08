import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import "./index.css";
import { App } from "./App";

// Simple fetcher for SWR
const fetcher = (url: string) => 
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ 
      fetcher,
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }}>
      <App />
    </SWRConfig>
  </StrictMode>
);
