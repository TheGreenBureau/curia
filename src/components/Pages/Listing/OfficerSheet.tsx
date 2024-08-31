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
import { Officer, OfficerType } from "@/types/data/persons";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { produce } from "immer";
import { Save, Trash2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { useCurrentListing, useTitles } from "@/hooks/queries";
import { v4 as uuidv4 } from "uuid";
import { Case } from "@/types/data/case";
import { ComboboxFree } from "@/components/ui/combobox";

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

  const currentListing = useCurrentListing();
  const updateListing = useMutateCurrentListing();
  const titlesQuery = useTitles();

  const { t } = useTranslation();

  const updateOfficer = <K extends keyof Officer>(
    key: K,
    value: Officer[K]
  ) => {
    setOfficer(
      produce(officer, (draft) => {
        draft[key] = value;
      })
    );
  };

  const isNew = !officer || officer.id === "";

  if (currentListing.isSuccess && titlesQuery.isSuccess) {
    const titles = () => {
      switch (officer.type) {
        case "presiding":
        case "secretary":
        case "member":
          return titlesQuery.data.court;
        case "layman":
          return titlesQuery.data.layman;
        default:
          return titlesQuery.data.prosecutor;
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
                {isNew
                  ? t("strings:Lisää uusi virkamies")
                  : t("strings:Muokkaa virkamiestä")}
              </SheetTitle>
              <SheetDescription>
                {descriptionArray.join(" | ")}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 w-full mt-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("strings:Asema")}</Label>
                <div className="col-span-3">
                  <Select
                    value={officer.type}
                    onValueChange={(value) => {
                      if (value !== officer.type) {
                        setOfficer({
                          ...officer,
                          title: "",
                          type: value as OfficerType,
                        });
                        return;
                      }

                      updateOfficer("type", value as OfficerType);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("strings:Valitse")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="presiding">
                          {t("officerPositions:presiding")}
                        </SelectItem>
                        <SelectItem value="secretary">
                          {t("officerPositions:secretary")}
                        </SelectItem>
                        <SelectItem value="member">
                          {t("officerPositions:member")}
                        </SelectItem>
                        <SelectItem value="layman">
                          {t("officerPositions:layman")}
                        </SelectItem>
                        <SelectItem value="prosecutor">
                          {t("officerPositions:prosecutor")}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="officer-name" className="text-right">
                  {t("strings:Nimi")}
                </Label>
                <Input
                  id="officer-name"
                  value={officer.name}
                  className="col-span-3"
                  onChange={(e) => updateOfficer("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("strings:Virkanimike")}</Label>
                <ComboboxFree
                  className="col-span-3"
                  options={titles()}
                  value={officer.title ?? ""}
                  onChange={(currentValue) =>
                    updateOfficer("title", currentValue)
                  }
                  placeholderSelect={t("strings:Kirjoita tai valitse...")}
                />
              </div>
            </div>

            <SheetFooter className="mt-6">
              {!isNew && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mr-4">
                      <Trash2 className="mr-4" />
                      {t("strings:Poista")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("strings:Poista virkamies")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          "strings:Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("strings:Peruuta")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          updateListing.mutate(
                            produce(currentListing.data, (draft) => {
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
                        {t("strings:Jatka")}
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
                      produce(currentListing.data, (draft) => {
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
                  {t("strings:Tallenna")}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    );
  }
}
