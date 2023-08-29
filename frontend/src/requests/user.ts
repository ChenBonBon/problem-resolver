import request from ".";
import useLoginStore from "../stores/login";
import useUserStore from "../stores/user";

export async function getUser() {
    const { setLogined } = useLoginStore.getState();
    const { setUsername } = useUserStore.getState();

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

export async function forgetPassword(username: string) {
    const res = await request(`/api/user/forget?username=${username}`, "GET");

    return res;
}

export async function resetPassword(password: string, stoken: string) {
    const res = await request("/api/user/reset", "PUT", { password, stoken });

    return res;
}
