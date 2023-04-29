import "antd/dist/reset.css";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import FullScreen from "./components/FullScreen";
import BasicLayout from "./layouts/BasicLayout";
import GuestLayout from "./layouts/GuestLayout";

const Home = lazy(() => import("./routes/Home"));
const Learn = lazy(() => import("./routes/Learn"));
const ProblemSet = lazy(() => import("./routes/ProblemSet"));

function App() {
  return (
    <FullScreen>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route path="" element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="problem-set" element={<ProblemSet />} />
        </Route>
        <Route path="/login" element={<GuestLayout />} />
      </Routes>
    </FullScreen>
  );
}

export default App;
