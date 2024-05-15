import { ImgHTMLAttributes } from "react";
import Logo from "../../img/curia-logo.svg";

export function CuriaLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={Logo} {...props} />;
}
