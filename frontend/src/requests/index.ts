import useLoadingStore from "../stores/loading";
import { toast } from "../utils";

export default async function request(
  url: string,
  method: RequestInit["method"],
  body?: any
) {
  const { setLoading } = useLoadingStore.getState();

  const options: RequestInit = {
    method,
    credentials: "omit",
  };

  const headers: RequestInit["headers"] = {
    "Content-Type": "application/json",
  };

  const token = window.localStorage.getItem("token");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  options.headers = headers;

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    setLoading(true);
    const res = await fetch(url, options);
    setLoading(false);

    if (res) {
      try {
        const json: {
          code: number;
          msg: string;
          data?: any;
          status?: number;
          title?: string;
        } = await res.json();
        if (json) {
          const { code, status, title } = json;
          if (code === 0) {
            return json;
          }

          if (status === 401) {
            toast("error", title ?? "用户信息失效，请重新登录");
            window.localStorage.removeItem("token");
            return null;
          } else {
            toast("error", "Oops，接口异常了");
            return null;
          }
        }

        return null;
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
