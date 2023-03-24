import { lazy } from "react";

const Home = lazy(() => import("./routes/Home"));
const Learn = lazy(() => import("./routes/Learn"));
const ProblemSet = lazy(() => import("./routes/ProblemSet"));
const CreateProblem = lazy(() => import("./routes/CreateProblem"));
const EditProblem = lazy(() => import("./routes/EditProblem"));

export default [
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
    key: "problem-set",
    path: "/problem-set",
    element: <ProblemSet />,
  },
  {
    key: "problem",
    path: "/problem",
    element: <CreateProblem />,
  },
  {
    key: "problem/detail",
    path: "/problem/:id",
    element: <EditProblem />,
  },
];
