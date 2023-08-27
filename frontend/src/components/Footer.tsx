import { Link } from "@radix-ui/themes";
import { styled } from "styled-components";

const Wrapper = styled.footer`
  position: absolute;
  bottom: 0;
  text-align: center;
  padding: 16px 0;
  width: 100%;
  background-color: white;
  z-index: 1;
`;

export default function Footer() {
  return (
    <Wrapper>
      <Link href="https://beian.miit.gov.cn/" target="_blank">
        {import.meta.env.VITE_COPYRIGHT}
      </Link>
    </Wrapper>
  );
}
