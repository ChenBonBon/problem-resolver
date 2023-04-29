interface IIcon {
  svg: string;
  className?: string;
}

export default function Icon(props: IIcon) {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: props.svg }}
      className={props.className}
    ></i>
  );
}
