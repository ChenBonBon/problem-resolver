import { lazy } from "react";

interface IRoute {
  key: string;
  path: string;
  element: JSX.Element;
}

const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login/Login"));
const Learn = lazy(() => import("./routes/Learn"));
const Problems = lazy(() => import("./routes/Problems"));
const Problem = lazy(() => import("./routes/Problem"));
const MyProblems = lazy(() => import("./routes/my/MyProblems"));

const routes: IRoute[] = [
  {
    key: "home",
    path: "/",
    element: <Home />,
  },
  {
    key: "login",
    path: "/login",
    element: <Login />,
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
  {
    key: "myProblems",
    path: "/my-problems",
    element: <MyProblems />,
  },
];

export default routes;
