import { IExample } from "../../stores/problems";

export default function Example(
  props: IExample & {
    index: number;
  }
) {
  return <div>Example {props.index + 1}</div>;
}
