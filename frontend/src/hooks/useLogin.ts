import request from "../requests";
import useLoginStore from "../stores/login";
import useToast from "./useToast";

export default function useLogin() {
  const sended = useLoginStore((state) => state.sended);
  const setSended = useLoginStore((state) => state.setSended);
  const logined = useLoginStore((state) => state.logined);
  const setLogined = useLoginStore((state) => state.setLogined);
  const checked = useLoginStore((state) => state.checked);
  const username = useLoginStore((state) => state.username);
  const setUsername = useLoginStore((state) => state.setUsername);

  const { showToast } = useToast();

  async function getCode(email: string) {
    if (!checked) {
      showToast("error", "请先同意用户协议和隐私政策");
      return;
    }

    setSended(true);

    const res = await request(`/api/code?email=${email}`, "GET");

    if (res && res.code === 0) {
      showToast("success", "验证码已发送");
    }
  }

  async function loginWithPassword(username: string, password: string) {
    if (!checked) {
      showToast("error", "请先同意用户协议和隐私政策");
      return;
    }

    const res = await request("/api/login/password", "POST", {
      username,
      password,
    });
    if (res && res.code === 0) {
      const { username, token } = res.data;
      setLogined(true);
      window.localStorage.setItem("token", token);
      setUsername(username);
    }
  }

  async function loginWithCode(email: string, code: string) {
    if (!checked) {
      showToast("error", "请先同意用户协议和隐私政策");
      return;
    }

    const res = await request("/api/login/code", "POST", { email, code });
    if (res && res.code === 0) {
      const { username, token } = res.data;
      setLogined(true);
      window.localStorage.setItem("token", token);
      setUsername(username);
    }
  }

  async function logout() {
    const res = await request("/api/logout", "POST");
    if (res && res.code === 0) {
      setLogined(false);
      window.localStorage.removeItem("token");
    }
  }

  async function getUser() {
    if (window.localStorage.getItem("token")) {
      const res = await request("/api/user", "GET");

      if (res) {
        const { username, token } = res.data;
        setLogined(true);
        window.localStorage.setItem("token", token);
        setUsername(username);
      } else {
        setLogined(false);
        window.localStorage.removeItem("token");
      }
    } else {
      setLogined(false);
    }
  }

  return {
    sended,
    logined,
    username,
    getUser,
    getCode,
    loginWithPassword,
    loginWithCode,
    logout,
  };
}
