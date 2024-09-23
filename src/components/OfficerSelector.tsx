import { useResources } from "@/hooks/useResources";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Officer } from "@/types/data/persons";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/headings";
import { Label } from "./ui/label";
import { ComboCreate } from "./ui/combocreate";
import { optionsFromRecord } from "@/lib/dataFormat";

type OfficerValues = {
  presiding: Officer | null;
  secretary: Officer | null;
};

type OfficerSelectorProps = {
  onChange: (values: OfficerValues) => void;
  values: OfficerValues;
};

export function OfficerSelector({ onChange, values }: OfficerSelectorProps) {
  const resources = useResources();

  const titleOptions = optionsFromRecord(resources.data?.courtTitles);

  const { t } = useTranslation();

  const handleChange = (
    type: "presiding" | "secretary",
    prop: "name" | "title",
    value: string
  ) => {
    if (!values[type]) {
      onChange(
        produce(values, (draft) => {
          draft[type] = {
            type: type,
            id: uuidv4(),
            name: prop === "name" ? value ?? "" : "",
            title: prop === "title" ? value ?? undefined : undefined,
          };
        })
      );

      return;
    }

    if (values[type][prop] === value) {
      return;
    }

    onChange(
      produce(values, (draft) => {
        if (!draft[type]) return;

        draft[type][prop] = value;

        if (prop === "name" && value === "") {
          draft[type].title = "";
        }
      })
    );
  };

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
    return (
      <div className="flex flex-col items-center w-full gap-4">
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4">
            <Heading level="h5" className="col-start-2 col-span-3">
              {t("Puheenjohtaja")}
            </Heading>
            <Label htmlFor="presiding-name" className="text-right">
              {t("Nimi")}
            </Label>
            <Input
              id="presiding-name"
              value={values?.presiding?.name ?? ""}
              onChange={(e) =>
                handleChange("presiding", "name", e.target.value)
              }
              onClear={() => handleChange("presiding", "name", "")}
              className="col-span-3"
            />
            <Label className="text-right">{t("Virkanimike")}</Label>
            <ComboCreate
              className="col-span-3"
              options={titleOptions}
              disabled={
                resources.isPending ||
                resources.isFetching ||
                !values.presiding ||
                values.presiding.name === ""
              }
              value={values.presiding?.title ?? ""}
              onChange={(currentValue) =>
                handleChange("presiding", "title", currentValue)
              }
              placeholder={t("Kirjoita tai valitse...")}
              placeholderDisabled={t("Valitse edeltävä")}
            />
          </div>
        </div>
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4">
            <Heading level="h5" className="col-start-2 col-span-3">
              {t("strings:Pöytäkirjanpitäjä", "Pöytäkirjanpitäjä", {
                count: 1,
              })}
            </Heading>
            <Label htmlFor="secretary-name" className="text-right">
              {t("Nimi")}
            </Label>
            <Input
              id="secretary-name"
              value={values?.secretary?.name ?? ""}
              onChange={(e) =>
                handleChange("secretary", "name", e.target.value)
              }
              onClear={() => handleChange("secretary", "name", "")}
              className="col-span-3"
            />
            <Label className="text-right">{t("Virkanimike")}</Label>
            <ComboCreate
              className="col-span-3"
              options={titleOptions}
              disabled={
                resources.isPending ||
                resources.isFetching ||
                !values.secretary ||
                values.secretary.name === ""
              }
              value={values.secretary?.title ?? ""}
              onChange={(currentValue) => {
                handleChange("secretary", "title", currentValue);
              }}
              placeholder={t("Kirjoita tai valitse...")}
              placeholderDisabled={t("Valitse edeltävä")}
            />
          </div>
        </div>
      </div>
    );
  }
}
