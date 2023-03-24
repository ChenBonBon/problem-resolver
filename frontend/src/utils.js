import { message } from "antd";

export function findTargetValueInArray(array, key, value, target) {
  const result = array.find((item) => item[key] === value);

  return result?.[target];
}

export async function request(url, options) {
  const token = localStorage.getItem("token");
  try {
    const requestOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      requestOptions.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, requestOptions);

    const json = await res.json();

    if (res.status === 401) {
      if (window.location.pathname === "/login") {
        message.error(json.message);
        return null;
      } else {
        window.history.pushState(null, "", "/login");
      }
    }

    return json;
  } catch (error) {
    console.error(error);
  }
}
