import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensors,
  useSensor,
  DragStartEvent,
  UniqueIdentifier,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/Pages/Listing/SortableItem";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useCases } from "@/hooks/useCases";
import { useState } from "react";
import { Item } from "./Item";
import { createPortal } from "react-dom";

export function CaseList() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const [cases, updateCases] = useCases();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
    setOverId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = cases.findIndex((c) => c.id === active.id);
      const newIndex = cases.findIndex((c) => c.id === over.id);

      updateCases(arrayMove(cases, oldIndex, newIndex));
    }

    setActiveId(null);
    setOverId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;

    setOverId(over.id);
  }

  const getDestinationIndex = () => {
    return cases.findIndex((c) => c.id === overId);
  };

  const getOverlayCase = () => {
    const active = cases.find((c) => c.id === activeId);

    return {
      ...active,
      time: new Date(active.time),
    };
  };

  const dragIndex = (original: number) => {
    if (!activeId || !overId || activeId === overId) {
      return original;
    }

    const activeIndex = cases.findIndex((c) => c.id === activeId);
    const overIndex = cases.findIndex((c) => c.id === overId);

    if (activeIndex === original) {
      return getDestinationIndex();
    }

    if (original > activeIndex && original > overIndex) {
      return original;
    }

    if (original > activeIndex && original <= overIndex) {
      return original - 1;
    }

    if (original < activeIndex && original < overIndex) {
      return original;
    }

    if (original < activeIndex && original >= overIndex) {
      return original + 1;
    }

    return original;
  };

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={cases} strategy={verticalListSortingStrategy}>
          {cases.map((c, index) => (
            <SortableItem
              key={c.id}
              item={{
                ...c,
                time: new Date(c.time),
              }}
              index={dragIndex(index)}
            />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeId ? (
              <Item
                item={getOverlayCase()}
                index={getDestinationIndex()}
                className="dark:border-sy-06"
              />
            ) : null}
          </DragOverlay>,
          document.getElementById("app")
        )}
      </DndContext>
    </div>
  );
}
