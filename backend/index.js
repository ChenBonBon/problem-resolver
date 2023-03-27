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

app.listen(3000);
console.log("Server is running on 3000");
