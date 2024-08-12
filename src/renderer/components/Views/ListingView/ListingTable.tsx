import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Case } from "data/Case";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyButton, SyLucide, SyModal, SyTextbox } from "@purplebureau/sy-react";
import { useTranslation } from "react-i18next";
import { format as dateFormat } from "date-fns";
import { OfficerListing } from "./OfficerListing";
import { useCurrentListing, useDefaults } from "@hooks/queries";
import { produce } from "immer";
import { useUpdateCurrentListing } from "@hooks/mutations";
import { v4 as uuidv4 } from "uuid";

function RowDragHandleCell({ rowId, index }: { rowId: string; index: number }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    <div
      style={{ cursor: "grab", display: "flex", gap: "0.5rem" }}
      {...attributes}
      {...listeners}
    >
      <h4>{index + 1}</h4>
      <SyLucide name="grip-vertical" />
    </div>
  );
}

const columnHelper = createColumnHelper<Case>();

type ListingTableProps = {
  cases: Case[];
};

export function ListingTable({ cases }: ListingTableProps) {
  const [currentCases, setCurrentCases] = useState(cases);

  const { data: currentListing } = useCurrentListing();
  const { mutate: updateListing } = useUpdateCurrentListing();
  const { data: defaults } = useDefaults();

  useEffect(() => {
    updateListing(
      produce(currentListing, (draft) => {
        draft.cases = currentCases;
      })
    );
  }, [currentCases]);

  useEffect(() => {
    setCurrentCases(currentListing?.cases ?? []);
  }, [currentListing]);

  const { t } = useTranslation();

  function DraggableRow({ row }: { row: Row<Case> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id,
    });

    const style: CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition: transition,
      zIndex: isDragging ? 1 : 0,
      position: "relative",
      backgroundColor: isDragging
        ? "var(--table-clickable-hover-color)"
        : undefined,
      color: isDragging ? "var(--table-clickable-foreground-color)" : undefined,
    };

    return (
      <tr ref={setNodeRef} style={style}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} style={{ width: cell.column.getSize() }}>
            <div className="cellContent">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </td>
        ))}
      </tr>
    );
  }

  function ListingTextBox({
    original,
    value,
    onChange,
  }: {
    original: Case;
    value: string;
    onChange: (found: Case, currentValue: string) => Case | null;
  }) {
    const [currentValue, setCurrentValue] = useState(value);

    return (
      <SyTextbox
        style={{ color: "var(--sy-text-color)" }}
        value={currentValue}
        onChange={(changedValue) => setCurrentValue(changedValue)}
        onBlur={() => {
          const modified = onChange(original, currentValue);
          if (modified) {
            const index = currentCases.findIndex((c) => c.id === modified.id);
            setCurrentCases(
              produce(currentCases, (draft) => {
                draft[index] = modified;
              })
            );
          }
        }}
      />
    );
  }

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => currentCases?.map(({ id }) => id),
    [currentCases]
  );

  const columns = useMemo<ColumnDef<Case>[]>(
    () => [
      {
        id: "drag-handle",
        cell: ({ row }) => (
          <RowDragHandleCell rowId={row.id} index={row.index} />
        ),
        size: 40,
      },
      columnHelper.accessor("time", {
        header: t("listings:Klo"),
        cell: (info) => dateFormat(info.getValue(), "HH:mm"),
        size: 60,
      }),
      columnHelper.accessor("matter", {
        header: t("listings:Asia"),
        cell: (info) => (
          <ListingTextBox
            original={info.row.original}
            value={info.getValue()}
            onChange={(original, value) => {
              return original.matter !== value
                ? {
                    ...original,
                    matter: value,
                  }
                : null;
            }}
          />
        ),
      }),
      columnHelper.accessor("caseNumber", {
        header: t("listings:Asianumero"),
        cell: (info) => (
          <ListingTextBox
            original={info.row.original}
            value={info.getValue()}
            onChange={(original, value) => {
              return original.caseNumber !== value
                ? {
                    ...original,
                    caseNumber: value,
                  }
                : null;
            }}
          />
        ),
      }),
      columnHelper.accessor("prosecutorCaseNumber", {
        header: t("listings:Asianro_sja"),
        cell: (info) => (
          <ListingTextBox
            original={info.row.original}
            value={info.getValue()}
            onChange={(original, value) => {
              return original.prosecutorCaseNumber !== value
                ? {
                    ...original,
                    prosecutorCaseNumber: value,
                  }
                : null;
            }}
          />
        ),
      }),
      columnHelper.accessor("officers", {
        header: t("listings:Virkamiehet"),
        cell: (info) =>
          info.getValue() ? (
            <OfficerListing
              officers={info.getValue()}
              caseNumber={info.row.original.caseNumber ?? ""}
              matter={info.row.original.matter ?? ""}
              caseID={info.row.original.id}
              caseIndex={info.row.index}
            />
          ) : null,
      }),
    ],
    [currentCases]
  );

  const table = useReactTable({
    data: currentCases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      const moved = arrayMove(currentCases, oldIndex, newIndex);
      setCurrentCases(moved);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const createCase = () => {
    const date = new Date(currentListing.date);
    date.setHours(9, 0, 0);

    const newCase: Case = {
      id: uuidv4(),
      caseNumber: "",
      prosecutorCaseNumber: "",
      matter: "",
      time: date,
      type: "criminal",
      officers: [defaults.presiding, defaults.secretary],
      civilians: [],
    };

    setCurrentCases([...currentCases, newCase]);
  };

  return (
    <>
      <div className="row" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginRight: "1rem" }}>
          {t("listings:listingViewCases")}
        </h2>
        <SyButton>Tuo CSV</SyButton>
        <SyButton onClick={createCase}>Uusi</SyButton>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.column.columnDef.size }}
                  >
                    <div className="content">
                      <h4 className="text">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </h4>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </tbody>
        </table>
        <pre>{JSON.stringify(currentListing.cases, null, 2)}</pre>
      </DndContext>
    </>
  );
}
