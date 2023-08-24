import dayjs from "dayjs";
import useToastStore, { IToastType } from "./stores/toast";

export function addNumberUnit(num: number) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e4, symbol: "W" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;

  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }

  return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
}

export function toast(type: IToastType, description: string) {
  const { setType, setDescription, setVisible } = useToastStore.getState();

  setType(type);
  setDescription(description);
  setVisible(true);
}

export function date(value: string) {
  return dayjs(value).format("YYYY-MM-DD HH:mm");
}
