import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Listing } from "@/types/data/listing";
import { Button } from "@/components/ui/button";
import { isDateArraySortedByTime, sortDates } from "@/lib/utils";
import { produce } from "immer";
import { useMutateCurrentListing, useMutateOpenCSV } from "@/hooks/mutations";
import { useTranslation } from "react-i18next";
import { PlusCircle, Clock, Text, Plus } from "lucide-react";

type ListingMenuProps = {
  listing: Listing;
  onOpenCaseSheet: () => void;
};

export function ListingMenu({ listing, onOpenCaseSheet }: ListingMenuProps) {
  const updateListing = useMutateCurrentListing();
  const openCSV = useMutateOpenCSV();

  const { t } = useTranslation();

  const sortCasesByTime = () => {
    const sorted = produce(listing.cases, (draft) => {
      draft.sort((a, b) => {
        const aDate = new Date(a.time);
        const bDate = new Date(b.time);

        const date1 = new Date();
        const date2 = new Date();
        date1.setHours(aDate.getHours(), aDate.getMinutes());
        date2.setHours(bDate.getHours(), bDate.getMinutes());

        return sortDates(date1, date2, "asc");
      });
    });

    updateListing.mutate(
      produce(listing, (draft) => {
        draft.cases = sorted;
      })
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t("strings:Muokkaa")}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => sortCasesByTime()}
          disabled={isDateArraySortedByTime(
            listing.cases.map((c) => new Date(c.time))
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{t("strings:Aikajärjestys")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenCaseSheet}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>{t("strings:Luo uusi")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openCSV.mutate({ type: "criminal" })}>
          <Text className="mr-2 h-4 w-4" />
          <span>{t("strings:Tuo CSV")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
