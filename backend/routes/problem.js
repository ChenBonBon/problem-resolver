const Router = require("koa-router");
const ProblemModel = require("../databases/models/problem");
const router = new Router();
const { resolveAuthorizationHeader } = require("../utils");
const jsonwebtoken = require("jsonwebtoken");

router.get("/", async (ctx) => {
  try {
    const res = await ProblemModel.find();

    ctx.body = {
      data: res,
    };
  } catch (error) {
    ctx.body = {
      message: error,
    };
  }
});

router.get("/:id", async (ctx) => {
  const params = ctx.params;
  const { id } = params;
  try {
    const res = await ProblemModel.findOne({ _id: id });

    ctx.body = res;
  } catch (error) {
    ctx.body = {
      message: error,
    };
  }
});

router.post("/", async (ctx) => {
  const body = ctx.request.body;
  const { title, description, answer, difficulty, status } = body;
  const token = resolveAuthorizationHeader(ctx);
  const user = jsonwebtoken.decode(token);
  const problem = new ProblemModel({
    title,
    description,
    answer,
    difficulty,
    status,
    createUserId: user.id,
  });

  try {
    const res = await problem.save();

    if (res) {
      ctx.body = { message: "问题创建成功" };
    } else {
      ctx.body = { message: "问题创建失败" };
    }
  } catch (error) {
    ctx.body = {
      message: error,
    };
  }
});

router.put("/:id", async (ctx) => {
  const params = ctx.params;
  const body = ctx.request.body;
  const { id } = params;
  const { title, description, answer, difficulty, status } = body;

  try {
    const problem = await ProblemModel.findById(id, {
      title: 1,
      description: 1,
      answer: 1,
      difficulty: 1,
      status: 1,
    });

    problem.title = title;
    problem.description = description;
    problem.answer = answer;
    problem.difficulty = difficulty;
    problem.status = status;

    const res = await problem.save();

    if (res) {
      ctx.body = { message: "问题更新成功" };
    } else {
      ctx.body = { message: "问题更新失败" };
    }
  } catch (error) {
    ctx.body = {
      message: error,
    };
  }
});

module.exports = router;
