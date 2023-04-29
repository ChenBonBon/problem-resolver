import { ConfigProvider, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import App from "./App";

dayjs.locale("zh-cn");

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<Spin spinning />}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <GlobalStyle />
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
