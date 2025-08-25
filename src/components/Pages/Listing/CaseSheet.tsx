import { TimePicker } from "@/components/ui/date-time-picker";
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
} from "@/components/ui/sheet";
import { Case } from "@/types/data/case";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { OfficerSelector } from "@/components/OfficerSelector";
import { produce } from "immer";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { useDefaults } from "@/hooks/queries";
import { useStore } from "@/hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import { ComboCreateCrime } from "@/components/ui/combocreate";

type CaseSheetProps = {
  getCase: () => Case;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CaseSheet({ getCase, open, onOpenChange }: CaseSheetProps) {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);

  const currentListing = useStore((state) => state.currentListing);
  const updateListing = useMutateCurrentListing();
  const defaults = useDefaults();

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      const given = getCase();
      if (given.id === "") {
        given.officers = [
          defaults.data?.presiding ?? null,
          defaults.data?.secretary ?? null,
        ].filter((o) => o !== null);
      }
      setCurrentCase(given);
    }
  }, [open]);

  const updateCase = <K extends keyof Case>(key: K, value: Case[K]) => {
    if (!currentCase) return;

    setCurrentCase(
      produce(currentCase, (draft) => {
        draft[key] = value;
      })
    );
  };

  const isNew = currentCase && currentCase.id === "";

  if (currentCase && defaults.isSuccess) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {currentCase && (
          <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {currentCase.id === "" ? t("Uusi juttu") : t("Muokkaa tietoja")}
              </SheetTitle>
              <SheetDescription>
                {currentCase.id === ""
                  ? t("Syötä uuden jutun tiedot.")
                  : t(
                      "Muokkaa jutun tietoja ja klikkaa tallenna, kun olet valmis."
                    )}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 w-full mt-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("Asiatyyppi")}</Label>
                <div className="col-span-3">
                  <Select
                    value={currentCase.type}
                    onValueChange={(value) =>
                      updateCase("type", value as "criminal" | "civil")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("Valitse")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="criminal">
                          {t("Rikosasia")}
                        </SelectItem>
                        <SelectItem value="civil">
                          {t("Siviiliasia")}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="case-number" className="text-right">
                  {t("Asianumero")}
                </Label>
                <Input
                  id="case-number"
                  value={currentCase.caseNumber}
                  className="col-span-3"
                  onChange={(e) => updateCase("caseNumber", e.target.value)}
                />
              </div>

              {currentCase.type === "criminal" && (
                <div className={"grid grid-cols-4 items-center gap-4"}>
                  <Label htmlFor="prosecutor-number" className="text-right">
                    {t("Asianro sjä")}
                  </Label>
                  <Input
                    id="prosecutor-number"
                    value={currentCase.prosecutorCaseNumber}
                    className="col-span-3"
                    onChange={(e) =>
                      updateCase("prosecutorCaseNumber", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="matter" className="text-right">
                  {t("Asia")}
                </Label>
                <ComboCreateCrime
                  className="col-span-3"
                  placeholder={t("Kirjoita tai valitse...")}
                  value={currentCase.matter}
                  onChange={(value) => updateCase("matter", value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("Kellonaika")}</Label>
                <div className="col-span-3">
                  <TimePicker
                    date={currentCase.time}
                    onChange={(date) =>
                      updateCase("time", date ?? currentCase.time)
                    }
                    granularity="minute"
                  />
                </div>
              </div>

              {isNew && (
                <OfficerSelector
                  values={{
                    presiding:
                      currentCase.officers.find(
                        (o) => o.type === "presiding"
                      ) ??
                      defaults?.data.presiding ??
                      null,
                    secretary:
                      currentCase.officers.find(
                        (o) => o.type === "secretary"
                      ) ??
                      defaults?.data.secretary ??
                      null,
                  }}
                  onChange={(values) => {
                    updateCase(
                      "officers",
                      [values.presiding, values.secretary].filter(
                        (o) => o !== null
                      )
                    );
                  }}
                />
              )}
            </div>
            <SheetFooter>
              {currentListing && (
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="mt-6 "
                    size="lg"
                    onClick={() => {
                      updateListing.mutate(
                        produce(currentListing, (draft) => {
                          if (isNew) {
                            draft.cases.push({
                              ...currentCase,
                              id: uuidv4(),
                            });
                          }

                          const index = draft.cases.findIndex(
                            (c) => c.id === currentCase.id
                          );

                          if (index !== -1) {
                            draft.cases[index] = currentCase;
                          }
                        })
                      );
                    }}
                  >
                    <Save className="mr-4" />
                    {t("Tallenna")}
                  </Button>
                </SheetClose>
              )}
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    );
  }
}
