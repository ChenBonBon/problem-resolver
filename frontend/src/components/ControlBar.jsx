import { Space } from "antd";
import styled from "styled-components";

const ControlBarWrapper = styled("div")`
  text-align: right;
  padding: 16px 8px;
`;

export default function ControlBar({ children }) {
  return <ControlBarWrapper>{<Space>{children}</Space>}</ControlBarWrapper>;
}
