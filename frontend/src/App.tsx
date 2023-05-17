import "antd/dist/reset.css";
import { lazy } from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import FullScreen from "./components/FullScreen";
import AdminLayout from "./layouts/AdminLayout";
import BasicLayout from "./layouts/BasicLayout";
import { store } from "./store";

const Home = lazy(() => import("./routes/Home"));
const Learn = lazy(() => import("./routes/Learn"));
const ProblemSet = lazy(() => import("./routes/ProblemSet"));

const AdminProblem = lazy(() => import("./routes/admin/Problem"));
const AdminProblemType = lazy(() => import("./routes/admin/ProblemType"));

const Login = lazy(() => import("./routes/login"));

function App() {
  return (
    <Provider store={store}>
      <FullScreen>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route path="" element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="problem-set" element={<ProblemSet />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route path="problem" element={<AdminProblem />} />
              <Route path="problem-type" element={<AdminProblemType />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </FullScreen>
    </Provider>
  );
}

export default App;
