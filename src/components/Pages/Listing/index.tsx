import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/headings";
import { Separator } from "@/components/ui/separator";
import {
  useMutateCurrentListing,
  useMutateDeselectListing,
} from "@/hooks/mutations";
import { useCourts, useCurrentListing, useDefaults } from "@/hooks/queries";
import { cn, isKey, sortDates } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronLeft, CircleSlash2 } from "lucide-react";
import { SessionEditSheet } from "./SessionEditSheet";
import styles from "./listing.module.css";
import { useStore } from "@/hooks/useStore";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { CaseSheet } from "./CaseSheet";
import { Case } from "@/types/data/case";
import { Defaults } from "@/types/config/defaults";
import { Officer } from "@/types/data/persons";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";
import { CaseList } from "./CaseList";
import { Row } from "@/components/ui/rowcol";
import { ModeToggle } from "@/components/ModeToggle";

const createNewCase = (defaults?: Defaults): Case => {
  const date = new Date();
  date.setHours(9, 0, 0);

  const officers: Officer[] = [];

  if (defaults?.presiding) {
    officers.push(defaults.presiding);
  }

  if (defaults?.secretary) {
    officers.push(defaults.secretary);
  }

  return {
    id: "",
    caseNumber: "",
    prosecutorCaseNumber: "",
    matter: "",
    time: date,
    type: "criminal",
    officers: officers,
    civilians: [],
  };
};

export function Listing() {
  const listing = useCurrentListing();
  const courts = useCourts();
  const deselectListing = useMutateDeselectListing();
  const updateListing = useMutateCurrentListing();

  const setMountDirection = useStore((state) => state.setMountDirection);
  const setShowSettings = useStore((state) => state.setShowSettings);
  const view = useStore((state) => state.welcomeView);
  const setView = useStore((state) => state.setWelcomeView);

  const { t } = useTranslation();

  useEffect(() => {
    setMountDirection("left");
    setShowSettings(false);
    if (view === undefined) {
      setView("initial");
    }
  });

  const sortCasesByTime = () => {
    const sorted = produce(listing.data.cases, (draft) => {
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
      produce(listing.data, (draft) => {
        draft.cases = sorted;
      })
    );
  };

  if (listing.isSuccess && courts.isSuccess) {
    const court = courts.data.find((c) => c.id === listing.data.court);

    const department =
      court && isKey(court.departments, listing.data.department)
        ? court.departments[listing.data.department]
        : "";

    const room =
      court && isKey(court.rooms, listing.data.room)
        ? court.rooms[listing.data.room]
        : "";

    return (
      <div className={cn("flex flex-col px-8 py-10 gap-4", styles.mountRight)}>
        <div className="flex flex-row w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full mr-4"
            onClick={() => deselectListing.mutate()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-4 items-center w-full">
              <Heading level="h2" className="mt-0">
                {court.name}
              </Heading>
              <SessionEditSheet
                getListing={() => {
                  return { ...listing.data };
                }}
              />
            </div>
            <div className="flex flex-row gap-4 items-center w-full flex-1">
              {listing.data.date && (
                <Heading level="h4" className="mt-0">
                  {format(listing.data.date, "dd.MM.yyyy")}
                </Heading>
              )}
              {listing.data.department && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <Heading level="h4" className="mt-0">
                    {department}
                  </Heading>
                </>
              )}
              {listing.data.room && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <Heading level="h4" className="mt-0">
                    {room}
                  </Heading>
                </>
              )}
              {listing.data.cases.length > 0 && (
                <Row className="justify-end flex-1 items-center">
                  <Button variant="outline" onClick={() => sortCasesByTime()}>
                    Aikajärjestykseen
                  </Button>
                  <CaseSheet
                    getCase={() => createNewCase()}
                    triggerLabel={t("strings:Uusi juttu")}
                  />
                </Row>
              )}
            </div>
          </div>
        </div>
        <Separator />
        {listing.data.cases.length === 0 ? (
          <Alert>
            <CircleSlash2 className="h-4 w-4" />
            <AlertTitle>{t("strings:Ei juttuja")}</AlertTitle>
            <AlertDescription className="text-muted-foreground flex flex-row gap-4 items-center">
              {t("strings:Juttuluettelo on toistaiseksi tyhjä.")}
            </AlertDescription>
            <div className="flex flex-row gap-4 mt-2">
              <CaseSheet
                getCase={() => createNewCase()}
                triggerLabel={t("strings:Uusi juttu")}
              />
              <Button variant="outline">Tuo CSV</Button>
            </div>
          </Alert>
        ) : (
          <CaseList />
        )}
      </div>
    );
  }
}
