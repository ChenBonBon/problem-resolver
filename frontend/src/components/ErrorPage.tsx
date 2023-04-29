import { Button, Result } from "antd";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IErrorPage {
  title?: ReactNode;
  subTitle?: ReactNode;
}

const StyledImg = styled("img")`
  width: 200px;
  height: 200px;
  border-radius: 200px;
`;

export default function ErrorPage({ title, subTitle }: IErrorPage) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      icon={<StyledImg src="/error.png" alt="error" />}
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}
