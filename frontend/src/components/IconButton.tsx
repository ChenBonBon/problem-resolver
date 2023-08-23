import { IconButton as DefaultIconButton } from "@radix-ui/themes";
import styled from "styled-components";

const IconButton = styled(DefaultIconButton)<{ onClick?: () => void }>`
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;

export default IconButton;
