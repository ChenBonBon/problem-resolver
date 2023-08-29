import request from ".";

export async function sendCode(email: string) {
    const res = await request(`/api/code?email=${email}`, "GET");

    return res;
}

export async function loginWithUsernameAndPassword(
    username: string,
    password: string
) {
    const res = await request("/api/login/password", "POST", {
        username,
        password,
    });

    return res;
}

export async function loginWithEmailAndCode(email: string, code: string) {
    const res = await request("/api/login/code", "POST", { email, code });

    return res;
}
