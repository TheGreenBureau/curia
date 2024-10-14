import { useMutateDefaults } from "@/hooks/mutations";
import { useDefaults } from "@/hooks/queries";
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
import { ProsecutorTitleSelector } from "@/components/Pages/Settings/ProsecutorTitleSelector";

export function Settings() {
  const defaults = useDefaults();
  const setDefaults = useMutateDefaults();
  const showSettings = useStore((state) => state.showSettings);

  const { t } = useTranslation();

  if (defaults.isSuccess) {
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
              {t("Asetukset")}
            </DialogTitle>
            <DialogDescription>
              {t("Hallinnoi sovelluksen yleisiä asetuksia")}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Heading level="h4">{t("Juttuluetteloiden sijainti")}</Heading>
            <DialogDescription>
              {t(
                "Tässä voit valita kansiosijainnin, josta juttuluetteloita etsitään ja johon ne tallennetaan."
              )}
            </DialogDescription>
          </div>
          <LocationSelector />
          <div>
            <Heading level="h4">{t("Oletustiedot")}</Heading>
            <DialogDescription>
              {t(
                "Tähän voit syöttää tiedot, jotka oletusarvoisesti annetaan uusille juttuluetteloille ja jutuille."
              )}
            </DialogDescription>
          </div>
          <div className="flex flex-row justify-center gap-2">
            <CourtSelector
              hasTitle
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
            <div className="flex flex-col justify-start gap-4 w-full">
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
              <Separator />
              <ProsecutorTitleSelector
                value={defaults.data.prosecutors}
                onChange={(value) =>
                  setDefaults.mutate(
                    produce(defaults.data, (draft) => {
                      draft.prosecutors = value;
                    })
                  )
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
