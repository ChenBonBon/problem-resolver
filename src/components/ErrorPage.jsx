import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function ErrorPage({ code = "404", description = "" }) {
  const navigate = useNavigate();

  return (
    <div className="hero bg-base-200 h-full">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/error.png"
          alt="error"
          className="max-w-xs shadow-2xl rounded-full"
        />
        <div>
          <h1 className="text-5xl font-bold">{code}</h1>
          <p className="py-6">{description}</p>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
