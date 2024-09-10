import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CuriaLogo } from "@/components/CuriaLogo";
import {
  SquarePlus,
  FolderOpen,
  ChevronLeft,
  AlertCircle,
  Download,
} from "lucide-react";
import clsx from "clsx";
import { useCourts, useDefaults, useRecents } from "@/hooks/queries";
import {
  useMutateCreateListing,
  useMutateDeleteListings,
  useMutateImportListing,
  useMutateOpenListing,
} from "@/hooks/mutations";
import styles from "./landing.module.css";
import { cn, formatListingName, isKey } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Defaults } from "@/types/config/defaults";
import { v4 as uuidv4 } from "uuid";
import { Listing } from "@/types/data/listing";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { fi } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { CourtSelector } from "@/components/CourtSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { useOpenListingsData } from "@/hooks/useOpenListingsData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/headings";
import { useStore } from "@/hooks/useStore";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export function Landing() {
  const view = useStore((state) => state.welcomeView);
  const setShowSettings = useStore((state) => state.setShowSettings);

  useEffect(() => {
    switch (view) {
      case "new":
        setShowSettings(false);
        break;
      case "open":
        setShowSettings(false);
        break;
      default:
        setShowSettings(true);
        break;
    }
  }, [view]);

  const { t } = useTranslation();

  const content = () => {
    switch (view) {
      case "new":
        return <LandingNew />;
      case "open":
        return <LandingOpen />;
      default:
        return <LandingInitial />;
    }
  };

  return (
    <div className="ml-auto mr-auto mt-20 w-fit max-w-[80%] flex flex-col justify-center gap-2">
      <CuriaLogo className="w-36 ml-auto mr-auto" />
      <Heading level="h2" className="text-center mt-6">
        {t("strings:Tervetuloa Curiaan!")}
      </Heading>
      {content()}
    </div>
  );
}

function LandingInitial() {
  const recents = useRecents();
  const courts = useCourts();
  const view = useStore((state) => state.welcomeView);
  const setView = useStore((state) => state.setWelcomeView);
  const mountDirection = useStore((state) => state.mountDirection);
  const setMountDirection = useStore((state) => state.setMountDirection);

  const { mutate } = useMutateOpenListing();

  const { t } = useTranslation();

  const formatRecentLabel = (recent: Listing) => {
    if (!courts.isSuccess) {
      return "";
    }

    const court = courts.data.find((c) => c.id === recent.court);

    if (!court) {
      return `${t("strings:Tuntematon")} | ${format(
        recent.date,
        "dd.MM.yyyy"
      )}`;
    }

    const office = court.offices[recent.office];

    const room =
      office && isKey(office.rooms, recent.room)
        ? office.rooms[recent.room]
        : "";

    return `${court.name} | ${
      room !== "" ? room : t("strings:Ei salia")
    } | ${format(recent.date, "dd.MM.yyyy")}`;
  };

  return (
    <div className={cn(view !== undefined && styles[mountDirection])}>
      <p className="text-center">
        {t(
          "strings:Aloita luomalla uusi tai valitsemalla aiemmin luotu juttuluettelo."
        )}
      </p>
      <div className="flex flex-row ml-auto mr-auto justify-center w-full gap-4">
        <Button
          className="h-14 mt-4"
          onClick={() => {
            setMountDirection("right");
            setView("new");
          }}
        >
          <SquarePlus className="mr-2 h-6 w-6" />
          {t("strings:Luo uusi")}
        </Button>
        <Button
          className="h-14 mt-4"
          onClick={() => {
            setMountDirection("right");
            setView("open");
          }}
        >
          <FolderOpen className="mr-2 h-6 w-6" />
          {t("strings:Avaa")}
        </Button>
      </div>
      <Heading level="h4" className="text-center mt-12 font-semibold">
        {t("strings:Viimeisimmät juttuluettelot")}
      </Heading>
      {recents.isSuccess && (
        <>
          {!recents.data || recents.data.length === 0 ? (
            <p className="mt-4 text-center">
              {t("strings:Ei juttuluetteloita")}
            </p>
          ) : (
            <div className="flex flex-col justify-center items-center ml-auto mr-auto gap-2 mt-4">
              {recents.data.map((r) => (
                <a
                  className={clsx(
                    badgeVariants({ variant: "default" }),
                    "cursor-pointer"
                  )}
                  key={r.id}
                  onClick={() => mutate(r.id)}
                >
                  {formatRecentLabel(r)}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LandingNew() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selections, setSelections] = useState<Defaults>({
    court: "",
    office: "",
    department: "",
    room: "",
    presiding: null,
    secretary: null,
    break: null,
  });

  const { data } = useDefaults();
  const { mutate } = useMutateCreateListing();

  const setView = useStore((state) => state.setWelcomeView);
  const mountDirection = useStore((state) => state.mountDirection);
  const setMountDirection = useStore((state) => state.setMountDirection);

  useEffect(() => {
    if (data) {
      setSelections(data);
    }
  }, [data]);

  const { t } = useTranslation();

  const handleCreateClick = async () => {
    if (!date) {
      return;
    }

    const newListing: Listing = {
      ...selections,
      id: uuidv4(),
      creationDate: new Date(),
      date: date,
      cases: [],
    };

    mutate(newListing);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full items-center justify-center",
        styles[mountDirection]
      )}
    >
      <p>
        {t(
          "strings:Valitse uuden juttuluettelon tuomioistuimen tiedot ja päivämäärä."
        )}
      </p>
      <div className="flex flex-col w-full items-center justify-center gap-4 my-4">
        <CourtSelector
          courtId={selections?.court ?? ""}
          values={selections}
          onChange={(values) => {
            setSelections({
              ...selections,
              ...values,
            });
          }}
        />
        <div className="grid grid-cols-4 items-center w-full gap-4">
          <Label className="text-right">{t("strings:Päivämäärä")}</Label>
          <div className="col-span-3">
            <DateTimePicker
              value={date}
              locale={fi}
              onChange={(selected) => setDate(selected)}
              granularity="day"
              displayFormat={{ hour24: "dd.MM.yyyy" }}
            />
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <Button
        className="w-100"
        disabled={Boolean(
          selections.court === "" ||
            selections.office === "" ||
            selections.department === "" ||
            selections.room === ""
        )}
        onClick={handleCreateClick}
      >
        {t("strings:Luo")}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="my-10"
        onClick={() => {
          setMountDirection("left");
          setView("initial");
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </div>
  );
}

function LandingOpen() {
  const { columns, data, isSuccess, isError } = useOpenListingsData();
  const [alertOpen, setAlertOpen] = useState(false);

  const remove = useMutateDeleteListings();
  const add = useMutateImportListing();

  const setView = useStore((state) => state.setWelcomeView);
  const mountDirection = useStore((state) => state.mountDirection);
  const setMountDirection = useStore((state) => state.setMountDirection);

  useEffect(() => {
    if (remove.isError || (remove.isSuccess && remove.data.errors.length > 0)) {
      setAlertOpen(true);
    }
  }, [remove.isError, remove.data, remove.isSuccess]);

  const { t } = useTranslation();

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("strings:Virhe")}</AlertTitle>
        <AlertDescription>
          {t("strings:Juttuja ei voitu noutaa")}
        </AlertDescription>
      </Alert>
    );
  }

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-col w-full items-center justify-center",
          styles[mountDirection]
        )}
      >
        <AlertDialog
          open={alertOpen}
          onOpenChange={(open) => setAlertOpen(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("strings:Virhe")}</AlertDialogTitle>
              <AlertDialogDescription>
                {!remove.isSuccess ? (
                  t(
                    "strings:Juttuluetteloiden poistamisessa tapahtui määrittämätön virhe."
                  )
                ) : (
                  <div>
                    <p>
                      {t(
                        "strings:Kaikkia juttuluettelotiedostoja ei voitu poistaa. Seuraavat tiedostot ovat poistamatta"
                      )}
                    </p>
                    <ul>
                      {remove.data.errors.map((error) => (
                        <li>{error}</li>
                      ))}
                    </ul>
                    <p>
                      {t("strings:Poista tiedostot kansiosta manuaalisesti.")}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={remove.reset}>
                {t("strings:Jatka")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p>
          {t(
            "strings:Avaa aikaisempi, tallennettu juttuluettelo tai tuo luettelo tiedostosta."
          )}
        </p>
        <div className="container mx-auto py-2">
          <DataTable
            columns={columns}
            data={data}
            filter="global"
            getRowId={(row) => row.id}
            onRowsDeleted={remove.mutate}
          />
        </div>
        <Separator className="mb-6" />
        <Button variant="default" onClick={() => add.mutate()}>
          <Download className="h-4 w-4 mr-2" />
          {t("strings:Tuo tiedostosta")}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="my-10"
          onClick={() => {
            setMountDirection("left");
            setView("initial");
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
    );
  }
}
