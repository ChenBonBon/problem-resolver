const Router = require("koa-router");
const UserModel = require("../databases/models/user");
const router = new Router();
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");

router.post("/register", async (ctx) => {
  const body = ctx.request.body;
  const { username, password, confirmPassword } = body;
  if (password === confirmPassword) {
    const user = new UserModel({
      username,
      password,
      status: true,
    });

    try {
      const res = await user.save();

      if (res) {
        ctx.body = { message: "用户创建成功" };
      } else {
        ctx.body = { message: "用户创建失败" };
      }
    } catch (error) {
      ctx.body = {
        message: error,
      };
    }
  } else {
    ctx.body = { message: "两次密码输入不一致" };
  }
});

router.post("/login", async (ctx) => {
  const body = ctx.request.body;
  const { username, password } = body;

  try {
    const res = await UserModel.findOne({
      username,
      password,
    });

    if (res) {
      const token = jsonwebtoken.sign({ id: res._id }, secret, {
        expiresIn: "24h",
      });

      ctx.body = { token };
    } else {
      ctx.status = 401;
      ctx.body = { message: "用户名或密码错误" };
    }
  } catch (error) {
    ctx.body = {
      message: error,
    };
  }
});

module.exports = router;
