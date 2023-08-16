import Mock from "mockjs";
import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock({
  url: "/api/problems",
  method: "GET",
  body: Mock.mock({
    code: 0,
    "list|1-100": [
      {
        "id|+1": 1,
        name: "@cparagraph",
        "status|1": ["unsolved", "processing", "solved"],
        answers: "@natural(1, 1000)",
        passRate: "@float(0, 100, 2, 2)",
        "difficulty|1": ["easy", "medium", "hard"],
      },
    ],
  }),
});
