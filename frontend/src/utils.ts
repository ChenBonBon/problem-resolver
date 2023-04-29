import { message } from "antd";

export function findTargetValueInArray(
  array: any[],
  key: string,
  value: any,
  target: string
) {
  const result = array.find((item) => item[key] === value);

  return result?.[target];
}

export async function request(url: string, options?: RequestInit) {
  try {
    const requestOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(url, requestOptions);

    const json = await res.json();

    if (res.status === 401) {
      if (window.location.pathname === "/login") {
        message.error(json.message);
        return null;
      } else {
        localStorage.removeItem("token");
        window.history.replaceState(null, "", "/login");
      }
    }

    return json;
  } catch (error) {
    console.error(error);
  }
}
