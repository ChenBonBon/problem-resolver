import { Space } from "antd";
import { ReactNode } from "react";
import styled from "styled-components";

interface IControlBar {
  children?: ReactNode;
}

const ControlBarWrapper = styled("div")`
  text-align: right;
  padding: 16px 8px;
`;

export default function ControlBar({ children }: IControlBar) {
  return <ControlBarWrapper>{<Space>{children}</Space>}</ControlBarWrapper>;
}
