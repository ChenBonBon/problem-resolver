import { Button as DefaultButton } from "@radix-ui/themes";
import styled from "styled-components";

const Button = styled(DefaultButton)<{ onClick?: () => void }>`
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;

export default Button;
