import { useLocation, useNavigate } from "react-router-dom";

export default function useRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  function redirect() {
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
  }

  return redirect;
}
