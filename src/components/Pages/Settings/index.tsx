import { useMutateDefaults } from "@/hooks/mutations";
import { useCurrentListing, useDefaults } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CourtSelector } from "@/components/CourtSelector";
import { LocationSelector } from "./LocationSelector";
import { Settings as SettingsIcon } from "lucide-react";
import { Heading } from "@/components/ui/headings";
import { OfficerSelector } from "@/components/OfficerSelector";
import { produce } from "immer";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";

export function Settings() {
  const defaults = useDefaults();
  const setDefaults = useMutateDefaults();
  const showSettings = useStore((state) => state.showSettings);

  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "scale-100 transition-all duration-200",
            !showSettings && "scale-0"
          )}
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="uppercase font-dosis">
            {t("strings:Asetukset")}
          </DialogTitle>
          <DialogDescription>
            {t("strings:Hallinnoi sovelluksen yleisiä asetuksia")}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Heading level="h4">
            {t("strings:Juttuluetteloiden sijainti")}
          </Heading>
          <DialogDescription>
            {t(
              "strings:Tässä voit valita kansiosijainnin, josta juttuluetteloita etsitään ja johon ne tallennetaan."
            )}
          </DialogDescription>
        </div>
        <LocationSelector />
        <div>
          <Heading level="h4">{t("strings:Oletustiedot")}</Heading>
          <DialogDescription>
            {t(
              "strings:Tähän voit syöttää tiedot, jotka oletusarvoisesti annetaan uusille juttuluetteloille ja jutuille."
            )}
          </DialogDescription>
        </div>
        <div className="flex flex-row justify-center gap-2">
          <CourtSelector
            hasTitle
            courtId={defaults.data?.court ?? null}
            values={{
              court: defaults.data?.court ?? "",
              office: defaults.data?.office ?? "",
              department: defaults.data?.department ?? "",
              room: defaults.data?.room ?? "",
            }}
            onChange={(values) => {
              setDefaults.mutate({
                ...defaults.data,
                court: values.court,
                department: values.department,
                office: values.office,
                room: values.room,
              });
            }}
          />
          <Separator orientation="vertical" className="ml-6 mr-4" />
          <OfficerSelector
            values={{
              presiding: defaults.data?.presiding ?? null,
              secretary: defaults.data?.secretary ?? null,
            }}
            onChange={(values) => {
              setDefaults.mutate(
                produce(defaults.data, (draft) => {
                  draft.presiding = values.presiding;
                  draft.secretary = values.secretary;
                })
              );
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
