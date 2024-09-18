import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/headings";
import { Separator } from "@/components/ui/separator";
import { useMutateOpenCSV } from "@/hooks/mutations";
import { useCrimes } from "@/hooks/queries";
import { useResources } from "@/hooks/useResources";
import { useStore } from "@/hooks/useStore";
import { cn, isKey } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronLeft, CircleSlash2 } from "lucide-react";
import { SessionEditSheet } from "./SessionEditSheet";
import styles from "./listing.module.css";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { CaseSheet } from "./CaseSheet";
import { Case } from "@/types/data/case";
import { Defaults } from "@/types/config/defaults";
import { Officer } from "@/types/data/persons";
import { CaseList } from "./CaseList";
import { ListingMenu } from "@/components/Pages/Listing/ListingMenu";
import { optionsFromRecord } from "@/lib/dataFormat";

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
  const [caseSheetOpen, setCaseSheetOpen] = useState(false);

  const currentListing = useStore((state) => state.currentListing);
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  const {
    courts,
    courtTitles,
    prosecutorTitles,
    laymanTitles,
    isSuccess: resourcesIsSuccess,
  } = useResources();
  const crimes = useCrimes();
  const openCSV = useMutateOpenCSV();

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
  }, []);

  if (currentListing && courts.isSuccess) {
    const court = courts.data.find((c) => c.id === currentListing.court);
    const department = court?.departments.find(
      (d) => d.id === currentListing.department
    );
    const office = court?.offices.find((o) => o.id === currentListing.office);
    const room = office?.rooms.find((r) => r.id === currentListing.room);

    const titles = {
      court: optionsFromRecord(courtTitles.data),
      prosecutor: optionsFromRecord(prosecutorTitles.data),
      layman: optionsFromRecord(laymanTitles.data),
    };

    return (
      <div className={cn("flex flex-col px-8 py-10 gap-4", styles.mountRight)}>
        <CaseSheet
          getCase={() => createNewCase()}
          open={caseSheetOpen}
          onOpenChange={(open) => setCaseSheetOpen(open)}
        />
        <div className="flex flex-row w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full mr-4"
            onClick={() => setCurrentListing(null)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-4 items-center w-full">
              <Heading level="h2" className="mt-0">
                {court?.name ?? t("Tuntematon")}
              </Heading>
              <SessionEditSheet
                getListing={() => {
                  return { ...currentListing };
                }}
              />
            </div>
            <div className="flex flex-row gap-4 items-center w-full flex-1">
              <Heading level="h4" className="mt-0">
                {format(currentListing.date, "dd.MM.yyyy")}
              </Heading>
              {department && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <Heading level="h4" className="mt-0">
                    {department.name}
                  </Heading>
                </>
              )}
              {room && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <Heading level="h4" className="mt-0">
                    {room.name}
                  </Heading>
                </>
              )}
              {currentListing.cases.length > 0 &&
                resourcesIsSuccess &&
                crimes.isSuccess &&
                court && (
                  <ListingMenu
                    listing={currentListing}
                    onOpenCaseSheet={() => setCaseSheetOpen(true)}
                    court={court}
                    office={office ?? null}
                    department={department?.name ?? ""}
                    room={room?.name ?? ""}
                    date={currentListing.date}
                    cases={currentListing.cases}
                    courtTitles={titles.court}
                    prosecutorTitles={titles.prosecutor}
                    laymanTitles={titles.layman}
                    sessionBrake={currentListing.break}
                    crimes={crimes.data}
                  />
                )}
            </div>
          </div>
        </div>
        <Separator />
        {currentListing.cases.length === 0 ? (
          <Alert>
            <CircleSlash2 className="h-4 w-4" />
            <AlertTitle>{t("Ei juttuja")}</AlertTitle>
            <AlertDescription className="text-muted-foreground flex flex-row gap-4 items-center">
              {t("Juttuluettelo on toistaiseksi tyhjä.")}
            </AlertDescription>
            <div className="flex flex-row gap-4 mt-2">
              <Button variant="outline" onClick={() => setCaseSheetOpen(true)}>
                {t("Uusi juttu")}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  openCSV.mutate({ type: "criminal", currentListing })
                }
              >
                {t("Tuo CSV")}
              </Button>
            </div>
          </Alert>
        ) : (
          <CaseList />
        )}
      </div>
    );
  }
}
