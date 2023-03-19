import { Route, Routes } from "react-router-dom";
import BasicLayout from "./layouts/BasicLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<BasicLayout />}></Route>
      </Routes>
    </div>
  );
}

export default App;
