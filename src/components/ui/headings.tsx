import { cn } from "@/lib/utils";
import { BaseHTMLAttributes, PropsWithChildren } from "react";

type Level = "h1" | "h2" | "h3" | "h4" | "h5";

export function Heading(
  props: PropsWithChildren<
    BaseHTMLAttributes<HTMLHeadingElement> & { level: Level }
  >
) {
  const { children, className, level, ...rest } = props;

  const common = "mt-4 mb-0 font-bold font-dosis uppercase";

  const classes = () => {
    switch (level) {
      case "h1":
        return "text-4xl";
      case "h2":
        return "text-2xl";
      case "h3":
        return "text-xl";
      case "h4":
        return "text-l";
      default:
        return "text-sm";
    }
  };

  const Tag = level;

  return (
    <Tag className={cn(common, classes(), className)} {...rest}>
      {children}
    </Tag>
  );
}
