import { Route, Routes } from "react-router-dom";
import routes from "../../routes";
import NotFound from "../../routes/NotFound";

export default function Content() {
  return (
    <div className="flex-auto">
      <Routes>
        {routes.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
