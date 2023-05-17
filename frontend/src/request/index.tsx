import { message } from "antd";

const prefix = import.meta.env.VITE_API_PREFIX;

export default async function request(
  url: string,
  method?: string,
  data?: any,
  options?: RequestInit
) {
  try {
    const isGET = () => _method.toUpperCase() === "GET";
    const _method = method ?? "GET";

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    let requestOptions: RequestInit = {
      headers,
      method: _method,
      credentials: "omit",
    };

    if (!isGET()) {
      requestOptions.body = JSON.stringify(data);
    }

    if (options) {
      const { headers, ...rest } = options;

      const _headers = headers
        ? new Headers({
            "Content-Type": "application/json",
            ...headers,
          })
        : new Headers({
            "Content-Type": "application/json",
          });

      requestOptions = {
        ...requestOptions,
        ...rest,
        headers: _headers,
      };
    }

    const res = await fetch(prefix + url, requestOptions);

    if (res) {
      const { status } = res;
      const json = await res.json();
      if (json) {
        if (status === 401) {
          if (window.location.pathname === "/login") {
            message.error(json.errorMessage);
            return false;
          } else {
            localStorage.removeItem("token");
            window.history.replaceState(null, "", "/login");
            return false;
          }
        }
      }

      return json;
    }
  } catch (error) {
    console.error(error);
  }
}
