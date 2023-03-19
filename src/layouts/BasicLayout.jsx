import Content from "../components/layout/Content";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

export default function BasicLayout() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
