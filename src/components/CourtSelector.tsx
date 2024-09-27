import { useResources } from "@/hooks/useResources";
import { optionsFromData } from "@/lib/dataFormat";
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
  onChange: (values: CourtValues, validated: boolean) => void;
  values: CourtValues;
  hasTitle?: boolean;
};

export function CourtSelector({
  onChange,
  values,
  hasTitle,
}: CourtSelectorProps) {
  const resources = useResources();

  const { t } = useTranslation();

  if (resources.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("Virhe")}</AlertTitle>
        <AlertDescription>{t("Valintoja ei voitu noutaa.")}</AlertDescription>
      </Alert>
    );
  }

  if (resources.isSuccess) {
    const currentCourt = resources.data.courts.find(
      (c) => c.id === values.court
    );
    const currentOffice = currentCourt
      ? currentCourt.offices.find((o) => o.id === values.office)
      : null;

    const options = {
      courts: optionsFromData(resources.data.courts),
      departments: currentCourt
        ? optionsFromData(currentCourt.departments)
        : [],
      offices: currentCourt ? optionsFromData(currentCourt.offices) : [],
      rooms: currentOffice ? optionsFromData(currentOffice.rooms) : [],
    };

    const handleSelectionChange = (
      type: "court" | "office" | "department" | "room",
      value: string
    ) => {
      if (values[type] === value) {
        return;
      }

      const court = resources.data.courts?.find(
        (c) => c.id === (type === "court" ? value : values.court)
      );
      const departments = court?.departments;
      const offices = court?.offices;

      const department =
        departments && departments.length === 1 ? departments[0].id : "";
      const office = offices && offices.length === 1 ? offices[0].id : "";

      const rooms =
        office !== "" && offices?.find((o) => o.id === office)?.rooms;

      const room = rooms && rooms.length === 1 ? rooms[0].id : "";

      let newValues: CourtValues = values;

      switch (type) {
        case "court":
          newValues = produce(values, (draft) => {
            draft.court = value;
            draft.department = department;
            draft.office = office;
            draft.room = room;
          });
          break;
        case "department":
          if (!currentCourt) break;

          newValues = produce(values, (draft) => {
            draft.department = value;
          });
          break;
        case "office":
          newValues = produce(values, (draft) => {
            draft.office = value;
            draft.room = room;
          });
          break;
        default:
          newValues = produce(values, (draft) => {
            draft.room = value;
          });
          break;
      }

      onChange(newValues, validated(newValues));
    };

    const validated = (newValues: CourtValues) => {
      let valid = true;

      if (
        newValues.court === "" ||
        newValues.office === "" ||
        newValues.room === ""
      ) {
        valid = false;
      }

      if (newValues.department === "" && options.departments.length > 0) {
        valid = false;
      }

      return valid;
    };

    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-4 items-start gap-4">
            {hasTitle && (
              <Heading level="h5" className="col-span-3 col-start-2">
                {t("Istunto")}
              </Heading>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("Tuomioistuin")}</Label>
            <Combobox
              className="col-span-3"
              options={options.courts}
              disabled={resources.isPending || resources.isFetching}
              value={values.court}
              onChange={(currentValue) =>
                handleSelectionChange("court", currentValue)
              }
              placeholderSelect={t("Valitse")}
            />
          </div>
          {options.departments.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("Osasto")}</Label>
              <Combobox
                className="col-span-3"
                options={options.departments}
                disabled={
                  resources.isPending ||
                  resources.isFetching ||
                  !currentCourt ||
                  currentCourt.departments.length <= 1
                }
                value={values.department}
                onChange={(currentValue) =>
                  handleSelectionChange("department", currentValue)
                }
                placeholderSelect={t("Valitse")}
                placeholderDisabled={t("Valitse edeltävä")}
              />
            </div>
          )}
          {options.offices.length > 1 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("Kanslia")}</Label>
              <Combobox
                className="col-span-3"
                options={options.offices}
                disabled={
                  resources.isPending ||
                  resources.isFetching ||
                  (options.departments.length > 0 &&
                    values.department === "") ||
                  !currentCourt ||
                  currentCourt.offices.length <= 1
                }
                value={values.office}
                onChange={(currentValue) =>
                  handleSelectionChange("office", currentValue)
                }
                placeholderSelect={t("Valitse")}
                placeholderDisabled={t("Valitse edeltävä")}
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("Sali")}</Label>
            <Combobox
              className="col-span-3"
              options={options.rooms}
              disabled={
                resources.isPending ||
                resources.isFetching ||
                values.office === "" ||
                !currentOffice ||
                currentOffice.rooms.length <= 1
              }
              value={values.room}
              onChange={(currentValue) =>
                handleSelectionChange("room", currentValue)
              }
              placeholderSelect={t("Valitse")}
              placeholderDisabled={t("Valitse edeltävä")}
            />
          </div>
        </div>
      </div>
    );
  }
}
