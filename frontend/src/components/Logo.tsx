import { Link } from "@radix-ui/themes";
import { MouseEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface ILogo {
  src: string;
  alt?: string;
}

export default function Logo(props: ILogo) {
  const navigate = useNavigate();

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate("/");
    },
    [navigate]
  );

  return (
    <Link onClick={onClick}>
      <img src={props.src} alt={props.alt ?? "logo"} />
    </Link>
  );
}
