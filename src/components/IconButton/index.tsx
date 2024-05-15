import { CSSProperties, MouseEventHandler } from "react";
import { SyLucide } from "@purplebureau/sy-react";
import { clsx } from "clsx";

import "./iconbutton.scss";

type IconButtonProps = {
  name: string;
  size?: string;
  style?: CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export function IconButton({
  name,
  size,
  style,
  className,
  onClick,
}: IconButtonProps) {
  return (
    <SyLucide
      name={name}
      size={size}
      style={style}
      className={clsx("icon-button", className)}
      onClick={onClick}
    />
  );
}
