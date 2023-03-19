import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";

export default function Header() {
  const location = useLocation();

  return <Navbar />;
}
