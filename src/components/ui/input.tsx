import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CircleX, X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClear, ...props }, ref) => {
    const [hasFocus, setHasFocus] = React.useState(false);

    return (
      <div className={cn(className, "relative")}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            onClear && "pr-8",
            className
          )}
          ref={ref}
          {...props}
          onFocus={(e) => {
            setHasFocus(true);
            if (props.onFocus) {
              props.onFocus(e);
            }
          }}
          onBlur={(e) => {
            setHasFocus(false);
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
        />
        {onClear && (
          <div
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex justify-center items-center scale-0 transition-all duration-200 cursor-pointer hover:opacity-75",
              hasFocus && "scale-100"
            )}
            onClick={(e) => {
              e.preventDefault();
              onClear();
            }}
          >
            <X className="h-4 w-4" />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
