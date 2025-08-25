"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableHeader = exports.DataTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_table_1 = require("@tanstack/react-table");
const table_1 = require("@/components/ui/table");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/components/ui/button");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const input_1 = require("./input");
const rowcol_1 = require("./rowcol");
const headings_1 = require("./headings");
function DataTable({ columns, data, filter, additionalFilters, getRowId, onRowsDeleted, selections, onSelectionsChanged, }) {
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const [globalFilter, setGlobalFilter] = (0, react_1.useState)("");
    const [columnFilters, setColumnFilters] = (0, react_1.useState)([]);
    const [rowSelectionInternal, setRowSelectionInternal] = (0, react_1.useState)({});
    const rowSelection = selections ?? rowSelectionInternal;
    const setRowSelection = onSelectionsChanged ?? setRowSelectionInternal;
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onSortingChange: setSorting,
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
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
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasSelectedRows = table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start py-4 gap-2 w-full", children: [filter === "global" && ((0, jsx_runtime_1.jsxs)(rowcol_1.Col, { className: "w-full", children: [(0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h4", className: (0, utils_1.cn)(globalFilter !== "" && "text-teal-500"), children: t("Suodata juttulistoja") }, void 0), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: t("Kirjoita..."), value: globalFilter, onChange: (event) => {
                                    table.setGlobalFilter(event.target.value);
                                }, className: "w-full" }, void 0)] }, void 0)), additionalFilters && additionalFilters.map((filter) => filter)] }, void 0), (0, jsx_runtime_1.jsx)(headings_1.Heading, { level: "h3", className: "mb-4", children: t("Juttuluettelot") }, void 0), (0, jsx_runtime_1.jsx)("div", { className: "rounded-md border", children: (0, jsx_runtime_1.jsxs)(table_1.Table, { className: "scrollbar scrollbar-thumb-slate-500 scrollbar-w-2", children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)(table_1.TableRow, { children: headerGroup.headers.map((header) => {
                                    return ((0, jsx_runtime_1.jsx)(table_1.TableHead, { children: header.isPlaceholder
                                            ? null
                                            : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()) }, header.id));
                                }) }, headerGroup.id))) }, void 0), (0, jsx_runtime_1.jsx)(table_1.TableBody, { className: "scrollbar scrollbar-thumb-slate-500 scrollbar-w-2", children: table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => ((0, jsx_runtime_1.jsx)(table_1.TableRow, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => ((0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : ((0, jsx_runtime_1.jsx)(table_1.TableRow, { children: (0, jsx_runtime_1.jsx)(table_1.TableCell, { colSpan: columns.length, className: "h-24 text-center", children: t("Ei tuloksia") }, void 0) }, void 0)) }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 py-4 justify-end", children: [onRowsDeleted && ((0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialog, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "destructive", size: "sm", className: (0, utils_1.cn)("scale-0 transition-transform duration-200 mr-4", hasSelectedRows && "scale-100"), children: t("Poista valitut") }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: t("Poista valitut") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: t("Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?") }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: t("Peruuta") }, void 0), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: () => {
                                                    const selectedFiltered = table
                                                        .getFilteredSelectedRowModel()
                                                        .rows.map((row) => row.id);
                                                    onRowsDeleted(selectedFiltered);
                                                }, children: t("Jatka") }, void 0)] }, void 0)] }, void 0)] }, void 0)), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), children: t("Edellinen") }, void 0), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), children: t("Seuraava") }, void 0)] }, void 0)] }, void 0));
}
exports.DataTable = DataTable;
function SortableHeader({ column, label, }) {
    const getArrow = (sort) => {
        switch (sort) {
            case false:
                return;
            case "asc":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "ml-2 h-4 w-4" }, void 0);
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "ml-2 h-4 w-4" }, void 0);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), className: (0, utils_1.cn)("ml-3 mr-3", column.getCanSort() && column.getIsSorted() !== false && "ml-0 mr-0"), children: [label, column.getCanSort() && getArrow(column.getIsSorted())] }, void 0));
}
exports.SortableHeader = SortableHeader;
//# sourceMappingURL=data-table.js.map