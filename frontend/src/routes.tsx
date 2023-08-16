import { lazy } from "react";

interface IRoute {
  key: string;
  path: string;
  element: JSX.Element;
}

const Home = lazy(() => import("./routes/Home"));
const Learn = lazy(() => import("./routes/Learn"));
const Problems = lazy(() => import("./routes/Problems"));
const Problem = lazy(() => import("./routes/Problem"));

const routes: IRoute[] = [
  {
    key: "home",
    path: "/",
    element: <Home />,
  },
  {
    key: "learn",
    path: "/learn",
    element: <Learn />,
  },
  {
    key: "problems",
    path: "/problems",
    element: <Problems />,
  },
  {
    key: "problem",
    path: "/problems/:id",
    element: <Problem />,
  },
];

export default routes;
