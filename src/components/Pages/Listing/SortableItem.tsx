import { Case } from "@/types/data/case";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import { Item } from "./Item";

type SortableItemProps = {
  item: Case;
  index: number;
};

export function SortableItem({ item, index }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Item
      item={item}
      attributes={attributes}
      listeners={listeners}
      index={index}
      style={style}
      ref={setNodeRef}
    />
  );
}
