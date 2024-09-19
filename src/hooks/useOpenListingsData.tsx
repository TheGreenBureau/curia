import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { SortableHeader } from "@/components/ui/data-table";
import { compareAsc, format, parse } from "date-fns";
import { isKey } from "@/lib/utils";
import { useListings } from "@/hooks/queries";
import { useResources } from "@/hooks/useResources";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMutateOpenListing } from "@/hooks/mutations";
import { FolderOpen } from "lucide-react";

export type ListingData = {
  id: string;
  date: string;
  court: string;
  department: string;
  room: string;
  creation: string;
};

export const useOpenListingsData = () => {
  const { courts } = useResources();
  const listingsQuery = useListings();
  const open = useMutateOpenListing();

  const { t } = useTranslation();
  const helper = createColumnHelper<ListingData>();

  const getCourt = (courtId: string) => {
    return courts.data?.find((c) => c.id === courtId);
  };

  const getDepartment = (courtId: string, departmentId: string) => {
    const court = getCourt(courtId);

    return (
      (court && court.departments.find((d) => d.id === departmentId)?.name) ??
      "-"
    );
  };

  const getRoom = (courtId: string, officeId: string, roomId: string) => {
    const court = getCourt(courtId);

    const office = court && court.offices.find((o) => o.id === officeId);

    return (office && office.rooms.find((r) => r.id === roomId)?.name) ?? "-";
  };

  const columns: ColumnDef<ListingData, any>[] = courts.isSuccess
    ? [
        {
          id: "select",
          header: ({ table }) => {
            const selected = table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false;

            return (
              <Checkbox
                checked={selected}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            );
          },
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableGlobalFilter: false,
        },
        helper.accessor("court", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("Tuomioistuin")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("date", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("Päivämäärä")} />
          ),
          sortingFn: (rowA, rowB) => {
            const a = parse(rowA.original.date, "dd.MM.yyyy", new Date());
            const b = parse(rowB.original.date, "dd.MM.yyyy", new Date());

            return compareAsc(a, b);
          },
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("department", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("Osasto")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("room", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("Sali")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("creation", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("Luomisaika")} />
          ),
          sortingFn: (rowA, rowB) => {
            const a = parse(rowA.original.creation, "dd.MM.yyyy", new Date());
            const b = parse(rowB.original.creation, "dd.MM.yyyy", new Date());

            return compareAsc(a, b);
          },
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        {
          id: "open",
          header: t("Avaa"),
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => open.mutate(row.original.id)}
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
          ),
          enableSorting: false,
          enableGlobalFilter: false,
        },
      ]
    : [];

  const data = listingsQuery.isSuccess
    ? listingsQuery.data.map((listing) => {
        const court = getCourt(listing.court);
        const listingData: ListingData = {
          id: listing.id,
          court: court ? court.abbreviation : t("Tuntematon"),
          department: getDepartment(listing.court, listing.department),
          room: getRoom(listing.court, listing.office, listing.room),
          date: format(listing.date, "dd.MM.yyyy"),
          creation: format(listing.creationDate, "dd.MM.yyyy"),
        };

        return listingData;
      })
    : [];

  return { columns, data, listingsQuery };
};
