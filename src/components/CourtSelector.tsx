import { useCourtSelections } from "@/hooks/queries";
import { produce } from "immer";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Heading } from "@/components/ui/headings";
import { Label } from "./ui/label";

type CourtValues = {
  court: string;
  office: string;
  department: string;
  room: string;
};

type CourtSelectorProps = {
  courtId: string | null;
  onChange: (values: CourtValues) => void;
  values: CourtValues;
  hasTitle?: boolean;
};

export function CourtSelector({
  courtId,
  onChange,
  values,
  hasTitle,
}: CourtSelectorProps) {
  const { data, isPending, isFetching, isError, isSuccess } =
    useCourtSelections(courtId);

  const { t } = useTranslation();

  const handleSelectionChange = (
    type: "court" | "office" | "department" | "room",
    value: string
  ) => {
    if (values[type] === value) {
      return;
    }

    switch (type) {
      case "court":
        onChange(
          produce(values, (draft) => {
            draft.court = value;
            draft.department = "";
            draft.office = "";
            draft.room = "";
          })
        );
        break;
      case "office":
        onChange(
          produce(values, (draft) => {
            draft.office = value;
            draft.department = "";
            draft.room = "";
          })
        );
        break;
      case "department":
        onChange(
          produce(values, (draft) => {
            draft.department = value;
            draft.room = "";
          })
        );
        break;
      default:
        onChange(
          produce(values, (draft) => {
            draft.room = value;
          })
        );
        break;
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("strings:Virhe")}</AlertTitle>
        <AlertDescription>
          {t("strings:Valintoja ei voitu noutaa.")}
        </AlertDescription>
      </Alert>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-4 items-start gap-4">
            {hasTitle && (
              <Heading level="h5" className="col-span-3 col-start-2">
                {t("strings:Istunto")}
              </Heading>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Tuomioistuin")}</Label>
            <Combobox
              className="col-span-3"
              options={data.courts}
              disabled={isPending || isFetching}
              value={values.court}
              onChange={(currentValue) =>
                handleSelectionChange("court", currentValue)
              }
              placeholderSelect={t("strings:Valitse")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Kanslia")}</Label>
            <Combobox
              className="col-span-3"
              options={data.offices}
              disabled={isPending || isFetching || values.court === ""}
              value={values.office}
              onChange={(currentValue) =>
                handleSelectionChange("office", currentValue)
              }
              placeholderSelect={t("strings:Valitse")}
              placeholderDisabled={t("strings:Valitse edeltävä")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Osasto")}</Label>
            <Combobox
              className="col-span-3"
              options={data.departments}
              disabled={isPending || isFetching || values.office === ""}
              value={values.department}
              onChange={(currentValue) =>
                handleSelectionChange("department", currentValue)
              }
              placeholderSelect={t("strings:Valitse")}
              placeholderDisabled={t("strings:Valitse edeltävä")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Sali")}</Label>
            <Combobox
              className="col-span-3"
              options={data.rooms}
              disabled={isPending || isFetching || values.department === ""}
              value={values.room}
              onChange={(currentValue) =>
                handleSelectionChange("room", currentValue)
              }
              placeholderSelect={t("strings:Valitse")}
              placeholderDisabled={t("strings:Valitse edeltävä")}
            />
          </div>
        </div>
      </div>
    );
  }
}
