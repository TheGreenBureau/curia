import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  Column,
  RowSelectionState,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Col, Row } from "./rowcol";
import { Label } from "./label";
import { Heading } from "./headings";
import { Separator } from "./separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: "global";
  additionalFilters?: ReactNode[];
  getRowId: (row: TData) => string;
  onRowsDeleted?: (rowIds: string[]) => void;
  selections?: RowSelectionState;
  onSelectionsChanged?: (selections: RowSelectionState) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  additionalFilters,
  getRowId,
  onRowsDeleted,
  selections,
  onSelectionsChanged,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelectionInternal, setRowSelectionInternal] =
    useState<RowSelectionState>({});

  const rowSelection = selections ?? rowSelectionInternal;
  const setRowSelection = onSelectionsChanged ?? setRowSelectionInternal;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getRowId: getRowId,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnFilters,
    },
  });

  const { t } = useTranslation();

  const hasSelectedRows =
    table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

  return (
    <div>
      <div className="flex flex-col items-start py-4 gap-2 w-full">
        {filter === "global" && (
          <Col className="w-full">
            <Heading
              level="h4"
              className={cn(globalFilter !== "" && "text-teal-500")}
            >
              {t("strings:Suodata juttulistoja")}
            </Heading>
            <Input
              placeholder={t("strings:Kirjoita...")}
              value={globalFilter}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              className="w-full"
            />
          </Col>
        )}
        {additionalFilters && additionalFilters.map((filter) => filter)}
      </div>
      <Heading level="h3" className="mb-4">
        {t("strings:Juttuluettelot")}
      </Heading>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("strings:Ei tuloksia")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={"flex items-center space-x-2 py-4 justify-end"}>
        {onRowsDeleted && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className={cn(
                  "scale-0 transition-transform duration-200 mr-4",
                  hasSelectedRows && "scale-100"
                )}
              >
                {t("strings:Poista valitut")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("strings:Poista valitut")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "strings:Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("strings:Peruuta")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const selectedFiltered = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.id);

                    onRowsDeleted(selectedFiltered);
                  }}
                >
                  {t("strings:Jatka")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("strings:Edellinen")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("strings:Seuraava")}
        </Button>
      </div>
    </div>
  );
}

type SortableHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  label: string;
};

export function SortableHeader<TData, TValue>({
  column,
  label,
}: SortableHeaderProps<TData, TValue>) {
  const getArrow = (sort: false | "asc" | "desc") => {
    switch (sort) {
      case false:
        return;
      case "asc":
        return <ArrowDown className="ml-2 h-4 w-4" />;
      default:
        return <ArrowUp className="ml-2 h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "ml-3 mr-3",
        column.getCanSort() && column.getIsSorted() !== false && "ml-0 mr-0"
      )}
    >
      {label}
      {column.getCanSort() && getArrow(column.getIsSorted())}
    </Button>
  );
}
