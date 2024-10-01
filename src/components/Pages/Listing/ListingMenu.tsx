import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Listing,
  ListingDocumentProps,
  ProsecutorListingDocumentProps,
} from "@/types/data/listing";
import { Button } from "@/components/ui/button";
import { isDateArraySortedByTime, sortDates } from "@/lib/utils";
import { produce } from "immer";
import { useMutateCurrentListing, useMutateOpenCSV } from "@/hooks/mutations";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Text,
  Plus,
  Save,
  Globe,
  Section,
  FilePen,
  FilePenLine,
  Eye,
} from "lucide-react";
import { ListingDocument } from "@/components/pdf/ListingDocument";
import { Row } from "@/components/ui/rowcol";
import { DocumentDialog } from "./DocumentDialog";
import { format } from "date-fns";
import { Office } from "@/types/data/court";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { ProsecutorListingDocument } from "@/components/pdf/ProsecutorListingDocument";

type ListingMenuProps = ProsecutorListingDocumentProps & {
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
  const [documentPreview, setDocumentPreview] = useState<
    "public" | "prosecutor" | null
  >(null);

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

  const formatSaveName = (prosecutor?: boolean) => {
    const type = prosecutor
      ? (t("Syyttäjä") as string).toUpperCase()
      : (t("Julkinen") as string).toUpperCase();

    return `${[
      format(rest.date, "yyyy-MM-dd"),
      rest.court.abbreviation,
      Object.keys(rest.court.offices).length > 1 ? office?.name ?? null : null,
      rest.room ?? null,
    ]
      .filter((p) => p !== null)
      .join(" ")}, ${type}.pdf`;
  };

  const buttonClasses =
    "h-10 w-10 px-0 py-0 actionmenu:h-10 actionmenu:px-4 actionmenu:py-2 actionmenu:w-auto";

  return (
    <Row className="justify-end flex-1 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={buttonClasses}>
            <FilePen className="h-5 w-5" />
            <span className="hidden actionmenu:inline-block actionmenu:ml-2">
              {t("Muokkaa")}
            </span>
          </Button>
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
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={buttonClasses}>
            <Eye className="h-5 w-5" />
            <span className="hidden actionmenu:inline-block actionmenu:ml-2">
              {t("Tarkasta")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setDocumentPreview("public")}
            className="cursor-pointer"
          >
            <Globe className="mr-2 h-4 w-4" />
            <span>{t("Julkinen")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDocumentPreview("prosecutor")}
            className="cursor-pointer"
          >
            <Section className="mr-2 h-4 w-4" />
            <span>{t("Syyttäjä")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={buttonClasses}>
            <Save className="h-5 w-5" />
            <span className="hidden actionmenu:inline-block actionmenu:ml-2">
              {t("Tallenna")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            <PDFDownloadLink
              document={<ListingDocument {...rest} />}
              fileName={formatSaveName()}
            >
              {t("Julkinen")}
            </PDFDownloadLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Section className="mr-2 h-4 w-4" />
            <PDFDownloadLink
              document={<ProsecutorListingDocument {...rest} />}
              fileName={formatSaveName(true)}
            >
              {t("Syyttäjä")}
            </PDFDownloadLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DocumentDialog
        prosecutor={documentPreview === "prosecutor"}
        open={Boolean(documentPreview)}
        onOpenChange={(open) => {
          if (!open) {
            setDocumentPreview(null);
          }
        }}
        {...rest}
      />
    </Row>
  );
}
