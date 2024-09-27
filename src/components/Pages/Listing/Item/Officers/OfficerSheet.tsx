import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Officer, OfficerType, OfficerTypeSchema } from "@/types/data/persons";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { produce } from "immer";
import { Save, Trash2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { useStore } from "@/hooks/useStore";
import { useResources } from "@/hooks/useResources";
import { v4 as uuidv4 } from "uuid";
import { Case } from "@/types/data/case";
import { ComboCreate } from "@/components/ui/combocreate";
import { optionsFromRecord } from "@/lib/dataFormat";

type OfficerSheetProps = {
  getOfficer: () => Officer;
  currentCase: Case;
};

export function OfficerSheet({
  children,
  getOfficer,
  currentCase,
}: PropsWithChildren<OfficerSheetProps>) {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [originalName, setOriginalName] = useState("");

  const currentListing = useStore((state) => state.currentListing);
  const updateListing = useMutateCurrentListing();
  const resources = useResources();

  const titleOptions = {
    court: optionsFromRecord(resources.data?.courtTitles),
    prosecutor: optionsFromRecord(resources.data?.prosecutorTitles),
    layman: optionsFromRecord(resources.data?.laymanTitles),
  };

  const positionOptions = optionsFromRecord(resources.data?.officerPositions);

  const { t } = useTranslation();

  const updateOfficer = <K extends keyof Officer>(
    key: K,
    value: Officer[K]
  ) => {
    if (!officer) {
      return;
    }

    setOfficer(
      produce(officer, (draft) => {
        draft[key] = value;
      })
    );
  };

  const isNew = !officer || officer.id === "";

  if (currentListing) {
    const titles = () => {
      if (!officer) return [];

      switch (officer.type) {
        case "prosecutor":
          return titleOptions.prosecutor;
        case "layman":
          return titleOptions.layman;
        default:
          return titleOptions.court;
      }
    };

    const descriptionArray: string[] = !officer
      ? []
      : [
          ...(currentCase.matter !== ""
            ? [currentCase.matter.toUpperCase()]
            : []),
          ...(currentCase.caseNumber !== "" ? [currentCase.caseNumber] : []),
          ...(originalName !== "" ? [originalName] : []),
        ];

    return (
      <Sheet>
        <SheetTrigger
          onClick={() => {
            const newOfficer = getOfficer();
            setOriginalName(newOfficer.name);
            setOfficer(newOfficer);
          }}
          asChild
        >
          {children}
        </SheetTrigger>
        {officer && (
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>
                {isNew ? t("Lisää uusi virkamies") : t("Muokkaa virkamiestä")}
              </SheetTitle>
              <SheetDescription>
                {descriptionArray.join(" | ")}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 w-full mt-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("Asema")}</Label>
                <div className="col-span-3">
                  <Select
                    value={officer.type}
                    onValueChange={(value) => {
                      try {
                        const officerType = OfficerTypeSchema.parse(value);

                        if (officerType !== officer.type) {
                          setOfficer({
                            ...officer,
                            title: "",
                            type: officerType,
                          });
                          return;
                        }

                        updateOfficer("type", officerType);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("Valitse")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="officer-name" className="text-right">
                  {t("Nimi")}
                </Label>
                <Input
                  id="officer-name"
                  value={officer.name}
                  className="col-span-3"
                  onChange={(e) => updateOfficer("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("Virkanimike")}</Label>
                <ComboCreate
                  className="col-span-3"
                  triggerClassName="col-span-3"
                  options={titles()}
                  value={officer.title ?? ""}
                  onChange={(currentValue) =>
                    updateOfficer("title", currentValue)
                  }
                />
              </div>
            </div>

            <SheetFooter className="mt-6">
              {!isNew && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mr-4">
                      <Trash2 className="mr-4" />
                      {t("Poista")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("Poista virkamies")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          "Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Peruuta")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          updateListing.mutate(
                            produce(currentListing, (draft) => {
                              const foundCaseIndex = draft.cases.findIndex(
                                (c) => c.id === currentCase.id
                              );

                              if (foundCaseIndex === -1) return;

                              const index = draft.cases[
                                foundCaseIndex
                              ].officers.findIndex((o) => o.id === officer.id);

                              if (index !== -1) {
                                draft.cases[foundCaseIndex].officers =
                                  draft.cases[foundCaseIndex].officers.filter(
                                    (o) => o.id !== officer.id
                                  );
                              }
                            })
                          );
                        }}
                      >
                        {t("Jatka")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateListing.mutate(
                      produce(currentListing, (draft) => {
                        const foundCaseIndex = draft.cases.findIndex(
                          (c) => c.id === currentCase.id
                        );

                        if (foundCaseIndex === -1) return;

                        if (isNew) {
                          draft.cases[foundCaseIndex].officers.push({
                            ...officer,
                            id: uuidv4(),
                          });
                        }

                        const index = draft.cases[
                          foundCaseIndex
                        ].officers.findIndex((o) => o.id === officer.id);

                        if (index !== -1) {
                          draft.cases[foundCaseIndex].officers[index] = officer;
                        }
                      })
                    );
                  }}
                >
                  <Save className="mr-4" />
                  {t("Tallenna")}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    );
  }
}
