import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Case } from "@/types/data/case";
import { Trash, Menu, NotebookPen } from "lucide-react";
import { useCase } from "@/hooks/useCases";

type ItemMenuProps = {
  item: Case;
  updateItem: (updated: Case) => void;
  saveItem: (updated?: Case) => void;
};

export function ItemMenu({ item }: ItemMenuProps) {}
