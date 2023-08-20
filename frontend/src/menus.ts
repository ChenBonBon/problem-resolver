export interface IMenu {
  key: string;
  label: string;
  link?: string;
  children?: IMenu[];
}

const menus: IMenu[] = [
  {
    key: "learn",
    label: "学习",
    link: "/learn",
  },
  {
    key: "problems",
    label: "题库",
    link: "/problems",
  },
];

export const avatarMenus: IMenu[] = [
  {
    key: "my-problems",
    label: "我的问题",
    link: "/my-problems",
  },
];

export default menus;
