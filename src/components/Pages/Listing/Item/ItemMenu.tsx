import {
  ForwardRefExoticComponent,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideProps, Menu } from "lucide-react";

type ItemMenuProps = {
  className?: string;
};

export function ItemMenu({
  children,
  className,
}: PropsWithChildren<ItemMenuProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

type MenuItemProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export function MenuItem({
  children,
  onClick,
  icon,
}: PropsWithChildren<MenuItemProps>) {
  const Icon = icon;

  return (
    <DropdownMenuItem onClick={onClick}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </DropdownMenuItem>
  );
}

type MenuSubItemProps = {
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  triggerContent: ReactNode;
  className?: string;
};

export function MenuSubItem({
  children,
  icon,
  triggerContent,
  className,
}: PropsWithChildren<MenuSubItemProps>) {
  const Icon = icon;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={className}>
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {triggerContent}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="p-4">
          {children}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
