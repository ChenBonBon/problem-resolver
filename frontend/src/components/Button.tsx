import { Button } from "@radix-ui/themes";
import styled from "styled-components";

const StyledButton = styled(Button)<{ onClick?: () => void }>`
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;

export default StyledButton;
