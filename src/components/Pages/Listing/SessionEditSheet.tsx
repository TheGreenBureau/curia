import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CourtSelector } from "@/components/CourtSelector";
import { useCurrentListing } from "@/hooks/queries";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { Pencil, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Listing } from "@/types/data/listing";
import { produce } from "immer";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { fi } from "date-fns/locale/fi";
import { useState } from "react";
import { Label } from "@/components/ui/label";

type SessionEditSheetProps = {
  getListing: () => Listing;
};

export function SessionEditSheet({ getListing }: SessionEditSheetProps) {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());
  const [values, setValues] = useState({
    court: "",
    office: "",
    department: "",
    room: "",
  });

  const updateListing = useMutateCurrentListing();

  const { t } = useTranslation();

  const assignListing = () => {
    const listing = getListing();

    setValues({
      ...listing,
    });

    setCurrentDate(new Date(listing.date));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={assignListing}>
          <Pencil />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("strings:Muokkaa tietoja")}</SheetTitle>
          <SheetDescription>
            {t(
              "strings:Tässä voit muokata tuomioistuimeen ja päivämäärään liittyviä yleisiä tietoja."
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col w-full justify-center gap-4 mt-6">
          <CourtSelector
            courtId={values.court}
            values={{ ...values }}
            onChange={(values) => {
              setValues({ ...values });
            }}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Päivämäärä")}</Label>
            <div className="col-span-3">
              <DateTimePicker
                value={currentDate}
                locale={fi}
                onChange={(selected) => setCurrentDate(selected)}
                granularity="day"
                displayFormat={{ hour24: "dd.MM.yyyy" }}
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="mt-6 "
              size="lg"
              onClick={() => {
                updateListing.mutate(
                  produce(getListing(), (draft) => {
                    draft.court = values.court;
                    draft.office = values.office;
                    draft.department = values.department;
                    draft.room = values.room;
                    draft.date = currentDate;
                  })
                );
              }}
            >
              <Save className="mr-4" />
              {t("strings:Tallenna")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
