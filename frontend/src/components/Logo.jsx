import { Link } from "react-router-dom";
import styled from "styled-components";
import { HeightFull } from "../constants";

const StyledLogo = styled(Link)`
  ${HeightFull}
`;

const StyleImg = styled("img")`
  ${HeightFull}
`;

export default function Logo() {
  return (
    <StyledLogo to="/">
      <StyleImg src="/logo.svg" alt="logo" />
    </StyledLogo>
  );
}
