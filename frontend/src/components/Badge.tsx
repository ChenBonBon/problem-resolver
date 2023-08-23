import { Badge as DefaultBadge } from "@radix-ui/themes";

export interface IBadge {
  value: string;
  map: { [key: string]: { label: string; color?: Color } };
}

export default function Badge(props: IBadge) {
  const { label, color } = props.map[props.value];
  return <DefaultBadge color={color}>{label}</DefaultBadge>;
}
