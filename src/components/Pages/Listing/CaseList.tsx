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
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function CaseList() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const [cases, updateCases] = useCases();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useGSAP(() => {
    gsap.to("#case-list", {
      x: 0,
      opacity: 1,
      scaleY: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });
  });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
    setOverId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cases.findIndex((c) => c.id === active.id);
      const newIndex = cases.findIndex((c) => c.id === over.id);

      updateCases(arrayMove(cases, oldIndex, newIndex));
    }

    setActiveId(null);
    setOverId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;

    if (over) {
      setOverId(over.id);
    }
  }

  const getDestinationIndex = () => {
    return cases.findIndex((c) => c.id === overId);
  };

  const getOverlayCase = () => {
    const active = cases.find((c) => c.id === activeId);

    if (!active) return null;

    return {
      ...active,
      time: new Date(active.time),
    };
  };

  const overlayCase = getOverlayCase();

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

  const rootElement = document.getElementById("app");

  return (
    <div id="case-list" className="flex flex-col gap-4 opacity-0 scaleY-0">
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
        {rootElement &&
          createPortal(
            <DragOverlay>
              {overlayCase ? (
                <Item
                  item={overlayCase}
                  index={getDestinationIndex()}
                  className="dark:border-sy-06"
                />
              ) : null}
            </DragOverlay>,
            rootElement
          )}
      </DndContext>
    </div>
  );
}
