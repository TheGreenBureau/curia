import { AnchorHTMLAttributes, PropsWithChildren, useState } from "react";
import { cn, getNodeText } from "@/lib/utils";
import { clsx } from "clsx";

export function Link(
  props: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>
) {
  const { children, ...rest } = props;
  const [hover, setHover] = useState(false);

  return (
    <span
      className="inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="w-fit pb-[2px] flex flex-col gap-[1px] items-center justify-center cursor-pointer">
        <a
          {...rest}
          className={clsx(
            rest.className,
            cn(
              "leading-4 text-sky-600 dark:text-cyan-500 no-underline transition-all duration-200",
              hover && "dark:text-amber-500"
            )
          )}
        >
          {getNodeText(children)}
        </a>
        <span
          className={clsx(
            cn(
              "transition-all duration-200 w-0 border-t-transparent border-t",
              hover && "w-full border-t-amber-500"
            )
          )}
        ></span>
      </span>
    </span>
  );
}
