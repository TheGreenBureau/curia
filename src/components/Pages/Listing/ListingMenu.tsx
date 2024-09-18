import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Listing, ListingDocumentProps } from "@/types/data/listing";
import { Button } from "@/components/ui/button";
import { isDateArraySortedByTime, sortDates } from "@/lib/utils";
import { produce } from "immer";
import { useMutateCurrentListing, useMutateOpenCSV } from "@/hooks/mutations";
import { useTranslation } from "react-i18next";
import { Clock, Text, Plus, Save } from "lucide-react";
import { ListingDocument } from "@/components/pdf/ListingDocument";
import { Row } from "@/components/ui/rowcol";
import { DocumentDialog } from "./DocumentDialog";
import { format } from "date-fns";
import { Office } from "@/types/data/court";
import { PDFDownloadLink } from "@react-pdf/renderer";

type ListingMenuProps = ListingDocumentProps & {
  listing: Listing;
  office: Office | null;
  onOpenCaseSheet: () => void;
};

export function ListingMenu({
  listing,
  onOpenCaseSheet,
  office,
  ...rest
}: ListingMenuProps) {
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

  const formatSaveName = () => {
    return `${[
      format(rest.date, "yyyy-MM-dd"),
      rest.court.abbreviation,
      Object.keys(rest.court.offices).length > 1 ? office?.name ?? null : null,
      rest.room ?? null,
    ]
      .filter((p) => p !== null)
      .join(" ")}, ${(t("Julkinen") as string).toUpperCase()}.pdf`;
  };

  return (
    <Row className="justify-end flex-1 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{t("Muokkaa")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => sortCasesByTime()}
            disabled={isDateArraySortedByTime(
              listing.cases.map((c) => new Date(c.time))
            )}
            className="cursor-pointer"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>{t("Aikajärjestys")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onOpenCaseSheet}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>{t("Luo uusi")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              openCSV.mutate({ type: "criminal", currentListing: listing })
            }
          >
            <Text className="mr-2 h-4 w-4" />
            <span>{t("Tuo CSV")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Save className="mr-2 h-4 w-4" />
            <PDFDownloadLink
              document={<ListingDocument {...rest} />}
              fileName={formatSaveName()}
            >
              {t("Tallenna PDF")}
            </PDFDownloadLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DocumentDialog {...rest} />
    </Row>
  );
}
