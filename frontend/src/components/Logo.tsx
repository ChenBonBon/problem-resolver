import { Link } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export interface ILogo {
  src: string;
  alt?: string;
}

export default function Logo(props: ILogo) {
  const navigate = useNavigate();

  return (
    <Link
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}
    >
      <img src={props.src} alt={props.alt ?? "logo"} />
    </Link>
  );
}
