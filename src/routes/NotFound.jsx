import ErrorPage from "../components/ErrorPage";

export default function NotFound() {
  return <ErrorPage code="404" description="Oops，页面好像走丢了哦" />;
}
