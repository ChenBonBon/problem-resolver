import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import Icon from "./Icon";

const StyledLogo = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
`;

const StyleImg = styled(Icon)`
  display: inline-flex;
`;

export default function Logo() {
  return (
    <StyledLogo to="/">
      <StyleImg svg={logo} />
    </StyledLogo>
  );
}
