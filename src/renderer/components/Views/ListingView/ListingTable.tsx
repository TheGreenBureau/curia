import React, { CSSProperties, useMemo, useState } from "react";
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
import { SyButton, SyLucide, SyModal } from "@purplebureau/sy-react";
import { useTranslation } from "react-i18next";
import { format as dateFormat } from "date-fns";
import { v4 as uuidv4 } from "uuid";

function RowDragHandleCell({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    <div style={{ cursor: "grab" }} {...attributes} {...listeners}>
      <SyLucide name="grip-vertical" />
    </div>
  );
}

function DraggableRow({ row }: { row: Row<Case> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

const columnHelper = createColumnHelper<Case>();

type ListingTableProps = {
  cases: Case[];
};

export function ListingTable({ cases }: ListingTableProps) {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Case>[]>(
    () => [
      {
        id: "drag-handle",
        header: t("listings:Järjestä"),
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 60,
      },
      columnHelper.accessor("time", {
        header: t("listings:Klo"),
        cell: (info) => dateFormat(info.getValue(), "hh:mm"),
      }),
      columnHelper.accessor("caseNumber", {
        header: t("listings:Asianumero"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("prosecutorCaseNumber", {
        header: t("listings:Asianro_sja"),
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const [data, setData] = useState([...cases]);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data]
  );

  const table = useReactTable({
    data,
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
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      <div className="row" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginRight: "1rem" }}>
          {t("listings:listingViewCases")}
        </h2>
        <SyButton>Tuo CSV</SyButton>
        <SyButton
          onClick={() => {
            const newCase: Case = {
              id: uuidv4(),
              caseNumber: "792/2024/123124",
              prosecutorCaseNumber: "901/2024/111241",
              matter: "Petos",
              time: new Date(),
              type: "criminal",
              members: [],
              plaintiffs: [],
              defendants: [],
              other: [],
            };
            setData([...data, newCase]);
          }}
        >
          Uusi
        </SyButton>
        <SyModal
          show={newModalOpen}
          closeRequested={() => setNewModalOpen(false)}
          header={t("listings:Uusi_juttu")}
        />
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
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </DndContext>
    </>
  );
}
