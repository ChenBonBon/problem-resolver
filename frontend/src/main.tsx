import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue">
      <Suspense>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
    </Theme>
  </React.StrictMode>
);
