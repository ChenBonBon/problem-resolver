import useToastStore, { IToastType } from "./stores/toast";

export function addNumberUnit(num: number) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e4, symbol: "W" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;

  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }

  return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
}

export function toast(type: IToastType, description: string) {
  const { setType, setDescription, setVisible } = useToastStore.getState();

  setType(type);
  setDescription(description);
  setVisible(true);
}

export async function request(
  url: string,
  method: RequestInit["method"],
  body?: RequestInit['body']
) {
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
    const res = await fetch(url, options);
    if (res) {
      try {
        const json = await res.json();
        if (json) {
          const { code, status, title } = json;
          if (code === 0) {
            return json;
          }

          if (status === 401) {
            toast("error", title);
            window.localStorage.removeItem("token");
            return null;
          } else {
            toast("error", title);
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
