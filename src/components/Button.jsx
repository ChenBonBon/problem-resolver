import classNames from "classnames";

const ButtonColor = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
};

const ButtonType = {
  default: "",
  ghost: "btn-ghost",
  link: "btn-link",
  outline: "btn-outline",
};

const ButtonSize = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const ButtonShape = {
  circle: "btn-circle",
  square: "btn-square",
  wide: "btn-wide",
};

export default function Button({
  children,
  active,
  disabled,
  glass,
  loading,
  block,
  shape,
  type = "default",
  color = "primary",
  animation = true,
  size = "md",
  onClick,
}) {
  return (
    <button
      className={classNames(
        "btn",
        ButtonColor[color],
        ButtonType[type],
        ButtonSize[size],
        shape && ButtonShape[shape],
        {
          "btn-active": active,
          "btn-disabled": disabled,
          "no-animation": !animation,
          "btn-block": block,
          glass,
          loading,
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
