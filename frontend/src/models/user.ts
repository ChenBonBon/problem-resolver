import { createModel } from "@rematch/core";
import request from "../request";
import type { RootModel } from "./";

type User = {
  id: string;
  name: string;
};

type VerificationParams = {
  email: string;
};

type RegisterParams =
  | VerificationParams
  | {
      code: string;
    };

type LoginParams = {
  username: string;
  password: string;
};

export const user = createModel<RootModel>()({
  state: {} as User,
  reducers: {
    setUser(state, payload: User) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getUser() {
      const res = await request("/users/current");

      if (res) {
        dispatch.user.setUser(res);
      }
    },
    async verification(payload: VerificationParams) {
      const res = await request("/users/verification", "POST", payload);

      return res;
    },
    async register(payload: RegisterParams) {
      const res = await request("/users/register", "POST", payload);

      return res;
    },
    async login(payload: LoginParams) {
      const res = await request("/users/login", "POST", payload);

      return res;
    },
  }),
});
