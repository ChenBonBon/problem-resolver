import useLoginStore from "../stores/login";
import { request } from "../utils";
import useToast from "./useToast";

export default function useLogin() {
  const sended = useLoginStore((state) => state.sended);
  const setSended = useLoginStore((state) => state.setSended);
  const logined = useLoginStore((state) => state.logined);
  const setLogined = useLoginStore((state) => state.setLogined);
  const checked = useLoginStore((state) => state.checked);
  const { setType, setVisible, setDescription } = useToast();

  async function getCode(email: string) {
    if (!checked) {
      setType("error");
      setDescription("请先同意用户协议和隐私政策");
      setVisible(true);
      return;
    }

    const res = await request(`/api/code?email=${email}`, "GET");

    if (res.code === 0) {
      setType("success");
      setDescription("验证码已发送");
      setVisible(true);
      setSended(true);
    }
  }

  async function loginWithPassword(username: string, password: string) {
    if (!checked) {
      setType("error");
      setDescription("请先同意用户协议和隐私政策");
      setVisible(true);
      return;
    }

    const res = await request("/api/login/password", "POST", {
      username,
      password,
    });
    if (res.code === 0) {
      setLogined(true);
      window.localStorage.setItem("token", res.data);
    }
  }

  async function loginWithCode(email: string, code: string) {
    if (!checked) {
      setType("error");
      setDescription("请先同意用户协议和隐私政策");
      setVisible(true);
      return;
    }

    const res = await request("/api/login/code", "POST", { email, code });
    if (res.code === 0) {
      setLogined(true);
      window.localStorage.setItem("token", res.data);
    }
  }

  async function logout() {
    const res = await request("/api/logout", "POST");
    if (res.code === 0) {
      setLogined(false);
      window.localStorage.removeItem("token");
    }
  }

  async function getUser() {
    if (window.localStorage.getItem("token")) {
      const res = await request("/api/token", "GET");

      if (res) {
        setLogined(true);
        window.localStorage.setItem("token", res.data);
      }
    } else {
      setLogined(false);
    }
  }

  return {
    sended,
    logined,
    getUser,
    getCode,
    loginWithPassword,
    loginWithCode,
    logout,
  };
}
