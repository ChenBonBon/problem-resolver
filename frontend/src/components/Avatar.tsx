import { Avatar as DefaultAvatar, DropdownMenu } from "@radix-ui/themes";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { IMenu } from "../menus";
import LinkText from "./LinkText";

export interface IAvatar {
  img: string;
  username: string;
  menus: IMenu[];
}

export default function Avatar(props: IAvatar) {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const key = (e.currentTarget as HTMLDivElement).dataset.key;
      const menu = props.menus.find((menu) => menu.key === key);

      if (menu?.link) {
        navigate(menu.link);
      }
    },
    [navigate, props.menus]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <LinkText>
          <DefaultAvatar src={props.img} fallback={props.username} />{" "}
          {props.username}
        </LinkText>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {props.menus?.map((menu) => (
          <DropdownMenu.Item
            key={menu.key}
            data-key={menu.key}
            onClick={onClick}
          >
            <LinkText>{menu.label}</LinkText>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={logout}>
          <LinkText>登出</LinkText>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
