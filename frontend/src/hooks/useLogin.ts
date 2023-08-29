import request from "../requests";
import {
    loginWithEmailAndCode,
    loginWithUsernameAndPassword,
    sendCode,
} from "../requests/login";
import { forgetPassword } from "../requests/user";
import useLoginStore from "../stores/login";
import useUserStore from "../stores/user";
import useToast from "./useToast";

export default function useLogin() {
    const sended = useLoginStore((state) => state.sended);
    const setSended = useLoginStore((state) => state.setSended);
    const logined = useLoginStore((state) => state.logined);
    const setLogined = useLoginStore((state) => state.setLogined);
    const checked = useLoginStore((state) => state.checked);
    const setUsername = useUserStore((state) => state.setUsername);

    const { showToast } = useToast();

    async function getCode(email: string) {
        if (!checked) {
            showToast("error", "请先同意用户协议和隐私政策");
            return;
        }

        setSended(true);

        const res = await sendCode(email);

        if (res && res.code === 0) {
            showToast("success", "验证码已发送");
        }
    }

    async function loginWithPassword(username: string, password: string) {
        if (!checked) {
            showToast("error", "请先同意用户协议和隐私政策");
            return;
        }

        const res = await loginWithUsernameAndPassword(username, password);

        if (res && res.code === 0) {
            const { username, token } = res.data;
            setLogined(true);
            window.localStorage.setItem("token", token);
            setUsername(username);
        }

        return res;
    }

    async function loginWithCode(email: string, code: string) {
        if (!checked) {
            showToast("error", "请先同意用户协议和隐私政策");
            return;
        }

        const res = await loginWithEmailAndCode(email, code);

        if (res && res.code === 0) {
            const { username, token } = res.data;
            setLogined(true);
            window.localStorage.setItem("token", token);
            setUsername(username);
        }

        return res;
    }

    async function logout() {
        const res = await request("/api/logout", "DELETE");

        if (res && res.code === 0) {
            setLogined(false);
            window.localStorage.removeItem("token");
        }
    }

    async function forget(username: string) {
        const res = await forgetPassword(username);

        if (res) {
            showToast("success", "密码重置成功，请查看邮箱");
        }
    }

    return {
        sended,
        logined,
        getCode,
        loginWithPassword,
        loginWithCode,
        logout,
        forget,
    };
}
