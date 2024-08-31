import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-sy-03 dark:hover:text-cyan-300 dark:hover:bg-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        presiding:
          "border-teal-600 text-foreground dark:border-teal-400 dark:text-teal-400",
        secretary:
          "border-amber-600 text-foreground dark:border-amber-400 dark:text-amber-400",
        member:
          "border-sky-600 text-foreground dark:border-sky-400 dark:text-sky-400",
        layman:
          "border-pink-600 text-foreground dark:border-pink-400 dark:text-pink-400",
        prosecutor:
          "border-purple-600 text-foreground dark:border-purple-400 dark:text-purple-400",
        defendant:
          "border-rose-600 text-foreground dark:border-rose-400 dark:text-rose-400",
        plaintiff:
          "border-lime-600 text-foreground dark:border-lime-400 dark:text-lime-400",
        injured:
          "border-lime-600 text-foreground dark:border-lime-400 dark:text-lime-400",
        witness:
          "border-fuchsia-600 text-foreground dark:border-fuchsia-400 dark:text-fuchsia-400",
        expert:
          "border-orange-600 text-foreground dark:border-orange-400 dark:text-orange-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
