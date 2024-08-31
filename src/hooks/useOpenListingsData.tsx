import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { SortableHeader } from "@/components/ui/data-table";
import { compareAsc, format, parse } from "date-fns";
import { isKey } from "@/lib/utils";
import { useCourts, useListings } from "@/hooks/queries";
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
  const { data: courts, isSuccess: courtsIsSuccess } = useCourts();

  const { data: listings, ...rest } = useListings();

  const open = useMutateOpenListing();

  const { t } = useTranslation();
  const helper = createColumnHelper<ListingData>();

  const getCourt = (courtId: string) => {
    return courts.find((c) => c.id === courtId);
  };

  const getOptionValue = (
    courtId: string,
    prop: "departments" | "offices" | "rooms",
    optionId: string
  ) => {
    const court = getCourt(courtId);

    if (court && isKey(court[prop], optionId)) {
      return court[prop][optionId];
    }

    return "-";
  };

  const columns: ColumnDef<ListingData>[] = courtsIsSuccess
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
            <SortableHeader column={column} label={t("strings:Tuomioistuin")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("date", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("strings:Päivämäärä")} />
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
            <SortableHeader column={column} label={t("strings:Osasto")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("room", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("strings:Sali")} />
          ),
          cell: ({ cell }) => (
            <div className="text-center">{cell.getValue()}</div>
          ),
        }),

        helper.accessor("creation", {
          header: ({ column }) => (
            <SortableHeader column={column} label={t("strings:Luomisaika")} />
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
          header: t("strings:Avaa"),
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

  const data = rest.isSuccess
    ? listings.map((listing) => {
        const court = getCourt(listing.court);
        const listingData: ListingData = {
          id: listing.id,
          court: court ? court.abbreviation : t("strings:Tuntematon"),
          department: getOptionValue(
            listing.court,
            "departments",
            listing.department
          ),
          room: getOptionValue(listing.court, "rooms", listing.room),
          date: format(listing.date, "dd.MM.yyyy"),
          creation: format(listing.creationDate, "dd.MM.yyyy"),
        };

        return listingData;
      })
    : [];

  return { columns, data, ...rest };
};
