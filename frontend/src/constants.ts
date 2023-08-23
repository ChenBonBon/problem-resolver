import { IBadge } from "./components/Badge";

export const AppName = import.meta.env.VITE_APP_NAME;
export const AppNameEn = import.meta.env.VITE_APP_NAME_EN;
export const smallBreakpoints = ["initial", "xs", "sm"];
export const difficultyMap: IBadge["map"] = {
  easy: { label: "简单", color: "green" },
  medium: { label: "中等", color: "orange" },
  hard: { label: "困难", color: "crimson" },
};
export const defaultProblemTypeMap: IBadge["map"] = {
  frontend: { label: "前端" },
  backend: { label: "后端" },
  algorithm: { label: "算法" },
  database: { label: "数据库" },
  other: { label: "其他" },
};
