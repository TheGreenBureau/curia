import { PropsWithChildren, BaseHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Col(
  props: PropsWithChildren<BaseHTMLAttributes<HTMLDivElement>>
) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={cn("flex flex-col gap-4 items-start", className)}>
      {children}
    </div>
  );
}

export function Row(
  props: PropsWithChildren<BaseHTMLAttributes<HTMLDivElement>>
) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={cn("flex flex-row gap-4 items-start", className)}>
      {children}
    </div>
  );
}
