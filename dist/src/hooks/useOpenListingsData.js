"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOpenListingsData = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_table_1 = require("@tanstack/react-table");
const react_i18next_1 = require("react-i18next");
const data_table_1 = require("@/components/ui/data-table");
const date_fns_1 = require("date-fns");
const queries_1 = require("@/hooks/queries");
const useResources_1 = require("@/hooks/useResources");
const checkbox_1 = require("@/components/ui/checkbox");
const button_1 = require("@/components/ui/button");
const mutations_1 = require("@/hooks/mutations");
const lucide_react_1 = require("lucide-react");
const useOpenListingsData = () => {
    const resources = (0, useResources_1.useResources)();
    const listingsQuery = (0, queries_1.useListings)();
    const open = (0, mutations_1.useMutateOpenListing)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const helper = (0, react_table_1.createColumnHelper)();
    const getCourt = (courtId) => {
        return resources.data?.courts.find((c) => c.id === courtId);
    };
    const getDepartment = (courtId, departmentId) => {
        const court = getCourt(courtId);
        return ((court && court.departments.find((d) => d.id === departmentId)?.name) ??
            "-");
    };
    const getRoom = (courtId, officeId, roomId) => {
        const court = getCourt(courtId);
        const office = court && court.offices.find((o) => o.id === officeId);
        return (office && office.rooms.find((r) => r.id === roomId)?.name) ?? "-";
    };
    const columns = resources.isSuccess
        ? [
            {
                id: "select",
                header: ({ table }) => {
                    const selected = table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false;
                    return ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { checked: selected, onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value), "aria-label": "Select all" }, void 0));
                },
                cell: ({ row }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { checked: row.getIsSelected(), onCheckedChange: (value) => row.toggleSelected(!!value), "aria-label": "Select row" }, void 0)),
                enableSorting: false,
                enableGlobalFilter: false,
            },
            helper.accessor("court", {
                header: ({ column }) => ((0, jsx_runtime_1.jsx)(data_table_1.SortableHeader, { column: column, label: t("Tuomioistuin") }, void 0)),
                cell: ({ cell }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: cell.getValue() }, void 0)),
            }),
            helper.accessor("date", {
                header: ({ column }) => ((0, jsx_runtime_1.jsx)(data_table_1.SortableHeader, { column: column, label: t("Päivämäärä") }, void 0)),
                sortingFn: (rowA, rowB) => {
                    const a = (0, date_fns_1.parse)(rowA.original.date, "dd.MM.yyyy", new Date());
                    const b = (0, date_fns_1.parse)(rowB.original.date, "dd.MM.yyyy", new Date());
                    return (0, date_fns_1.compareAsc)(a, b);
                },
                cell: ({ cell }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: cell.getValue() }, void 0)),
            }),
            helper.accessor("department", {
                header: ({ column }) => ((0, jsx_runtime_1.jsx)(data_table_1.SortableHeader, { column: column, label: t("Osasto") }, void 0)),
                cell: ({ cell }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: cell.getValue() }, void 0)),
            }),
            helper.accessor("room", {
                header: ({ column }) => ((0, jsx_runtime_1.jsx)(data_table_1.SortableHeader, { column: column, label: t("Sali") }, void 0)),
                cell: ({ cell }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: cell.getValue() }, void 0)),
            }),
            helper.accessor("creation", {
                header: ({ column }) => ((0, jsx_runtime_1.jsx)(data_table_1.SortableHeader, { column: column, label: t("Luomisaika") }, void 0)),
                sortingFn: (rowA, rowB) => {
                    const a = (0, date_fns_1.parse)(rowA.original.creation, "dd.MM.yyyy", new Date());
                    const b = (0, date_fns_1.parse)(rowB.original.creation, "dd.MM.yyyy", new Date());
                    return (0, date_fns_1.compareAsc)(a, b);
                },
                cell: ({ cell }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: cell.getValue() }, void 0)),
            }),
            {
                id: "open",
                header: t("Avaa"),
                cell: ({ row }) => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: () => open.mutate(row.original.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4" }, void 0) }, void 0)),
                enableSorting: false,
                enableGlobalFilter: false,
            },
        ]
        : [];
    const data = listingsQuery.isSuccess
        ? listingsQuery.data.map((listing) => {
            const court = getCourt(listing.court);
            const listingData = {
                id: listing.id,
                court: court ? court.abbreviation : t("Tuntematon"),
                department: getDepartment(listing.court, listing.department),
                room: getRoom(listing.court, listing.office, listing.room),
                date: (0, date_fns_1.format)(listing.date, "dd.MM.yyyy"),
                creation: (0, date_fns_1.format)(listing.creationDate, "dd.MM.yyyy"),
            };
            return listingData;
        })
        : [];
    return { columns, data, listingsQuery };
};
exports.useOpenListingsData = useOpenListingsData;
//# sourceMappingURL=useOpenListingsData.js.map