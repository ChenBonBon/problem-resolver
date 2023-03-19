import { lazy } from "react";

const Home = lazy(() => import("./routes/Home"));

export default [
  {
    key: "home",
    path: "/",
    element: <Home />,
  },
];
