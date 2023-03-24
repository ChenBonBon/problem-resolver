import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import BasicLayout from "./layouts/BasicLayout";
import GuestLayout from "./layouts/GuestLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestLayout />} />
      <Route
        path="*"
        element={
          <AuthRoute>
            <BasicLayout />
          </AuthRoute>
        }
      />
    </Routes>
  );
}

export default App;
