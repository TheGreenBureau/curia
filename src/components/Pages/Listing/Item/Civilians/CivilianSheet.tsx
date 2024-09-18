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
import {
  AllSummons,
  Civilian,
  CivilianType,
  DefendantSummonsSchema,
  OtherSummonsSchema,
  SummonsStatuses,
} from "@/types/data/persons";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ComboCreate } from "@/components/ui/combocreate";
import { optionsFromRecord } from "@/lib/dataFormat";
import { isKey } from "@/lib/utils";
import { Listing } from "@/types/data/listing";

type CivilianSheetProps = {
  getCivilian: () => Civilian;
  currentCase: Case;
};

export function CivilianSheet({
  children,
  getCivilian,
  currentCase,
}: PropsWithChildren<CivilianSheetProps>) {
  const [civilian, setCivilian] = useState<Civilian | null>(null);
  const [originalName, setOriginalName] = useState("");

  const currentListing = useStore((state) => state.currentListing);

  if (currentListing) {
    const isNew = !civilian || civilian.id === "";

    return (
      <Sheet>
        <SheetTrigger
          asChild
          onClick={() => {
            const newCivilian = getCivilian();
            setOriginalName(newCivilian.name);
            setCivilian(newCivilian);
          }}
        >
          {children}
        </SheetTrigger>
        {civilian && (
          <CivilianSheetContent
            currentCase={currentCase}
            civilian={civilian}
            isNew={isNew}
            originalName={originalName}
            setCivilian={setCivilian}
            currentListing={currentListing}
          />
        )}
      </Sheet>
    );
  }
}

type CivilianSheetContentProps = {
  currentCase: Case;
  civilian: Civilian;
  isNew: boolean;
  originalName: string;
  setCivilian: (civilian: Civilian) => void;
  currentListing: Listing;
};

function CivilianSheetContent({
  currentCase,
  civilian,
  isNew,
  originalName,
  setCivilian,
  currentListing,
}: CivilianSheetContentProps) {
  const updateListing = useMutateCurrentListing();

  const {
    summons: summonsResult,
    summonsStatus,
    civilianPositions,
  } = useResources();

  const summonOptions = {
    summons: optionsFromRecord(summonsResult.data),
    summonsStatus: optionsFromRecord(summonsStatus.data),
  };

  let positionOptions = optionsFromRecord(civilianPositions.data);
  if (currentCase.type === "criminal") {
    positionOptions = positionOptions.filter((o) => o.value !== "plaintiff");
  }

  const { t } = useTranslation();

  const updateCivilian = <K extends keyof Civilian>(
    key: K,
    value: Civilian[K]
  ) => {
    setCivilian(
      produce(civilian, (draft) => {
        draft[key] = value;
      })
    );
  };

  const onTypeChange = (value: string) => {
    if (
      value !== civilian.type &&
      (value === "defendant" || civilian.type === "defendant")
    ) {
      setCivilian({
        ...civilian,
        summonsType: undefined,
        type: value as CivilianType,
      });
      return;
    }

    updateCivilian("type", value as CivilianType);
  };

  const onDelete = () => {
    updateListing.mutate(
      produce(currentListing, (draft) => {
        const foundCaseIndex = draft.cases.findIndex(
          (c) => c.id === currentCase.id
        );

        if (foundCaseIndex === -1) return;

        const index = draft.cases[foundCaseIndex].civilians.findIndex(
          (c) => c.id === civilian.id
        );

        if (index !== -1) {
          draft.cases[foundCaseIndex].civilians = draft.cases[
            foundCaseIndex
          ].civilians.filter((c) => c.id !== civilian.id);
        }
      })
    );
  };

  const onSave = () => {
    updateListing.mutate(
      produce(currentListing, (draft) => {
        const foundCaseIndex = draft.cases.findIndex(
          (c) => c.id === currentCase.id
        );

        if (foundCaseIndex === -1) return;

        if (isNew) {
          draft.cases[foundCaseIndex].civilians.push({
            ...civilian,
            id: uuidv4(),
          });
        }

        const index = draft.cases[foundCaseIndex].civilians.findIndex(
          (c) => c.id === civilian.id
        );

        if (index !== -1) {
          draft.cases[foundCaseIndex].civilians[index] = civilian;
        }
      })
    );
  };

  const summons = () => {
    switch (civilian.type) {
      case "defendant":
        return summonOptions.summons.filter((s) => {
          try {
            DefendantSummonsSchema.parse(s);
            return true;
          } catch {
            return false;
          }
        });
      default:
        return summonOptions.summons.filter((s) => {
          try {
            OtherSummonsSchema.parse(s);
            return true;
          } catch {
            return false;
          }
        });
    }
  };

  const descriptionArray: string[] = !civilian
    ? []
    : [
        ...(currentCase.matter !== ""
          ? [currentCase.matter.toUpperCase()]
          : []),
        ...(currentCase.caseNumber !== "" ? [currentCase.caseNumber] : []),
        ...(originalName !== "" ? [originalName] : []),
      ];

  return (
    <SheetContent side="right" className="sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>
          {isNew ? t("Lisää uusi siviili") : t("Muokkaa siviiliä")}
        </SheetTitle>
        <SheetDescription>{descriptionArray.join(" | ")}</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 w-full mt-6">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">{t("Asema")}</Label>
          <div className="col-span-3">
            <Select value={civilian.type} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("Valitse")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {positionOptions.map((o) => (
                    <SelectItem value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="civilian-name" className="text-right">
            {t("Nimi")}
          </Label>
          <Input
            id="civilian-name"
            value={civilian.name}
            className="col-span-3"
            onChange={(e) => updateCivilian("name", e.target.value)}
          />
        </div>

        {(civilian.type === "defendant" ||
          civilian.type === "injured" ||
          civilian.type === "plaintiff") && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="civilian-counselor" className="text-right">
              {t("Avustaja")}
            </Label>
            <Input
              id="civilian-counselor"
              value={civilian.counselor ?? ""}
              className="col-span-3"
              onChange={(e) => updateCivilian("counselor", e.target.value)}
            />
          </div>
        )}

        {(civilian.type === "plaintiff" || civilian.type === "injured") && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="civilian-representative" className="text-right">
                {t("Edustaja")}
              </Label>
              <Input
                id="civilian-representative"
                value={civilian.representative ?? ""}
                className="col-span-3"
                onChange={(e) =>
                  updateCivilian("representative", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="civilian-trustee" className="text-right">
                {t("Edunvalvoja")}
              </Label>
              <Input
                id="civilian-trustee"
                value={civilian.trustee ?? ""}
                className="col-span-3"
                onChange={(e) => updateCivilian("trustee", e.target.value)}
              />
            </div>
          </>
        )}

        {civilian.type === "injured" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="civilian-demands" className="text-right">
              {t("Korvausvaatimus")}
            </Label>
            <Checkbox
              id="civilian-demands"
              className="h-6 w-6"
              checked={civilian.hasDemands ?? false}
              onCheckedChange={(checked) => {
                if (checked === "indeterminate") {
                  return;
                }
                updateCivilian("hasDemands", checked);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">{t("Kutsu")}</Label>
          <ComboCreate
            className="col-span-3"
            triggerClassName="col-span-3"
            options={summons()}
            value={civilian.summonsType ?? ""}
            onChange={(value) => {
              updateCivilian("summonsType", value as AllSummons);
            }}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">{t("Haastamistilanne")}</Label>
          <ComboCreate
            className="col-span-3"
            triggerClassName="col-span-3"
            options={summonOptions.summonsStatus}
            value={civilian.summonsStatus ?? ""}
            onChange={(value) => {
              updateCivilian("summonsStatus", value as SummonsStatuses);
            }}
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
                <AlertDialogTitle>{t("Poista siviili")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("Peruuta")}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  {t("Jatka")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <SheetClose asChild>
          <Button variant="outline" onClick={onSave}>
            <Save className="mr-4" />
            {t("Tallenna")}
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
