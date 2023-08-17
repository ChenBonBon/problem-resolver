import Mock from "mockjs";
import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock([
  {
    url: "/api/problems",
    method: "GET",
    body: Mock.mock({
      code: 0,
      "list|1-100": [
        {
          "id|+1": 1,
          name: "@csentence(4, 20)",
          "status|1": ["unsolved", "processing", "solved"],
          answers: "@natural(1, 10000)",
          passRate: "@float(0, 100, 2, 2)",
          "difficulty|1": ["easy", "medium", "hard"],
        },
      ],
    }),
  },
  {
    url: "/api/answers",
    method: "GET",
    body: Mock.mock({
      code: 0,
      data: {
        "id|+1": 1,
        answer: "@csentence(4, 20)",
        author: "@csentence(4, 20)",
      },
    }),
  },
  {
    url: "/api/problems/:id",
    method: "GET",
    body({ params }) {
      return Mock.mock({
        code: 0,
        data: {
          "id|+1": params.id,
          name: "@csentence(4, 20)",
          "status|1": ["unsolved", "processing", "solved"],
          answers: "@natural(1, 10000)",
          passRate: "@float(0, 100, 2, 2)",
          "difficulty|1": ["easy", "medium", "hard"],
          description: "@csentence(10, 100)",
          comments: "@natural(1, 10000)",
          "examples|1-10": [
            {
              "id|+1": 1,
              input: "@sentence(10, 20)",
              output: "@sentence(10, 20)",
              explanation: "@csentence(10, 100)",
            },
          ],
        },
      });
    },
  },
]);
