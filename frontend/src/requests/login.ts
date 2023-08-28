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

export async function forgetPassword(username: string) {
  const res = await request(`/api/login/forget?username=${username}`, "GET");

  return res;
}

export async function resetPassword(password: string, stoken: string) {
  const res = await request("/api/login/reset", "PUT", { password, stoken });

  return res;
}
