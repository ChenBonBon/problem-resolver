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
          name: "@cparagraph",
          "status|1": ["unsolved", "processing", "solved"],
          answers: "@natural(1, 10000)",
          passRate: "@float(0, 100, 2, 2)",
          "difficulty|1": ["easy", "medium", "hard"],
        },
      ],
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
          name: "@cparagraph",
          "status|1": ["unsolved", "processing", "solved"],
          answers: "@natural(1, 10000)",
          passRate: "@float(0, 100, 2, 2)",
          "difficulty|1": ["easy", "medium", "hard"],
          description: "@cparagraph",
          comments: "@natural(1, 10000)",
          "examples|1-10": [
            {
              "id|+1": 1,
              input: "@paragraph",
              output: "@paragraph",
              explanation: "@cparagraph",
            },
          ],
        },
      });
    },
  },
]);
