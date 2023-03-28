const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const mongoose = require("mongoose");
const jwt = require("koa-jwt");

const { db, secret } = require("./config");

const problemRoutes = require("./routes/problem");
const userRoutes = require("./routes/user");

const app = new Koa();
const router = new Router();

app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

app.use(async function (ctx, next) {
  try {
    return await next();
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = { message: "Token验证失败" };
    } else {
      throw err;
    }
  }
});

router.use(
  jwt({
    secret,
    cookie: "token",
    debug: true,
  }).unless({ path: [/^\/users/] })
);
router.use("/problems", problemRoutes.routes());
router.use("/users", userRoutes.routes());

mongoose
  .connect(
    `mongodb://${db.username}:${db.password}@localhost/problem?authSource=admin`
  )
  .catch((err) => {
    console.log(err);
  });

app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001);
console.log("Server is running on 3001");
