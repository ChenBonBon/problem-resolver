import { Link } from "react-router-dom";

export default function Logo(props) {
  return (
    <Link to="/" className="h-full">
      <img src={props.src} alt={props.alt} className="h-full" />
    </Link>
  );
}
