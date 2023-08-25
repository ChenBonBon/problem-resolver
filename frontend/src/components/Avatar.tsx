import { Avatar as DefaultAvatar, DropdownMenu } from "@radix-ui/themes";
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
            onClick={() => {
              if (menu.link) {
                navigate(menu.link);
              }
            }}
          >
            <LinkText>{menu.label}</LinkText>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={() => {
            logout();
          }}
        >
          <LinkText>登出</LinkText>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
