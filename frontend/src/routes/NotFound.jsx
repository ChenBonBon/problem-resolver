import ErrorPage from "../components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage status="404" code="404" subTitle="Oops，页面好像走丢了哦" />
  );
}
