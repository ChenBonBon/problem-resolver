import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

dayjs.locale("zh-cn");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<></>}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
