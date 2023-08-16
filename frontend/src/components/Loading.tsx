import { ReactNode } from "react";
import { keyframes, styled } from "styled-components";

interface ILoading {
  visible?: boolean;
  children?: ReactNode;
}

const LoadingContainer = styled("div")`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  color: #000000;
  gap: 8px;
  font-size: 12px;
`;

const LoadingItems = styled("div")`
  position: relative;
  box-sizing: border-box;
  display: block;
  font-size: 0;
  color: #000000;
  width: 32px;
  height: 32px;
`;

const loading = keyframes`
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 0;
    transform: scale(0);
  }
`;

const LoadingItem = styled("div")`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  margin-left: -4px;
  border-radius: 100%;
  animation: ${loading} 1s infinite ease-in-out;

  :nth-child(1) {
    top: 5%;
    left: 50%;
    animation-delay: -0.875s;
  }

  :nth-child(2) {
    top: 18.1801948466%;
    left: 81.8198051534%;
    animation-delay: -0.75s;
  }
  :nth-child(3) {
    top: 50%;
    left: 95%;
    animation-delay: -0.625s;
  }
  :nth-child(4) {
    top: 81.8198051534%;
    left: 81.8198051534%;
    animation-delay: -0.5s;
  }
  :nth-child(5) {
    top: 94.9999999966%;
    left: 50.0000000005%;
    animation-delay: -0.375s;
  }
  :nth-child(6) {
    top: 81.8198046966%;
    left: 18.1801949248%;
    animation-delay: -0.25s;
  }
  :nth-child(7) {
    top: 49.9999750815%;
    left: 5.0000051215%;
    animation-delay: -0.125s;
  }
  :nth-child(8) {
    top: 18.179464974%;
    left: 18.1803700518%;
    animation-delay: 0s;
  }
`;

export default function Loading(props: ILoading) {
  if (!props.visible) {
    return null;
  }

  return (
    <LoadingContainer>
      <LoadingItems>
        {new Array(8).fill(0).map((_, index) => (
          <LoadingItem key={index} />
        ))}
      </LoadingItems>
      {props.children}
    </LoadingContainer>
  );
}
