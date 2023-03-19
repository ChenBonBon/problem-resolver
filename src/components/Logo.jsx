import { Link } from "react-router-dom";

export default function Logo({ src = "/logo.svg", alt = "logo" }) {
  return (
    <Link to="/" className="h-full">
      <img src={src} alt={alt} className="h-full" />
    </Link>
  );
}
