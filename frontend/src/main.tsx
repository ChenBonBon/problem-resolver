import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import App from "./App.tsx";
import "./index.css";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue">
      <Suspense>
        <BrowserRouter>
          <SWRConfig
            value={{
              fetcher,
            }}
          >
            <App />
          </SWRConfig>
        </BrowserRouter>
      </Suspense>
    </Theme>
  </React.StrictMode>
);
