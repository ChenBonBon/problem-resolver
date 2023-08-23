import { lazy } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useLogin from "./hooks/useLogin";

interface IRoute {
  key: string;
  path: string;
  element: JSX.Element;
}

interface IAuthRoute {
  children: JSX.Element;
}

const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login/Login"));
const Learn = lazy(() => import("./routes/Learn"));
const Problems = lazy(() => import("./routes/Problems"));
const Problem = lazy(() => import("./routes/Problem"));
const MyProblems = lazy(() => import("./routes/my/MyProblems"));
const CreateProblem = lazy(() => import("./routes/my/CreateProblem"));

function AuthRoute(props: IAuthRoute) {
  const location = useLocation();
  const { logined } = useLogin();

  if (logined) {
    return props.children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
}

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
    element: (
      <AuthRoute>
        <MyProblems />
      </AuthRoute>
    ),
  },
  {
    key: "myProblems",
    path: "/problems/new",
    element: (
      <AuthRoute>
        <CreateProblem />
      </AuthRoute>
    ),
  },
];

export default routes;
