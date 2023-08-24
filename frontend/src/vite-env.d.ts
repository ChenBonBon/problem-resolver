/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_NAME_EN: string;
}

type Color =
  | "tomato"
  | "red"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "grass"
  | "brown"
  | "orange"
  | "sky"
  | "mint"
  | "lime"
  | "yellow"
  | "amber"
  | "gold"
  | "bronze"
  | "gray";

type Status = "enabled" | "disabled";
