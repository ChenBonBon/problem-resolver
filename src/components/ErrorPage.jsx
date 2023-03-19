import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function ErrorPage(props) {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <img
          src="/error.png"
          alt="error"
          className="w-24 rounded-full inline-block"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {props.code}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {props.description}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            block
            onClick={() => {
              navigate("/");
            }}
          >
            返回首页
          </Button>
        </div>
      </div>
    </main>
  );
}
