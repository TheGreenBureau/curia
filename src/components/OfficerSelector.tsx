import { useTitles } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ComboboxFree } from "@/components/ui/combobox";
import { Officer } from "@/types/data/persons";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/headings";
import { Label } from "./ui/label";
import { ComboCreate } from "./ui/combocreate";

type OfficerValues = {
  presiding: Officer | null;
  secretary: Officer | null;
};

type OfficerSelectorProps = {
  onChange: (values: OfficerValues) => void;
  values: OfficerValues;
};

export function OfficerSelector({ onChange, values }: OfficerSelectorProps) {
  const { data, isPending, isFetching, isSuccess, isError } = useTitles();

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
        draft[type][prop] = value;

        if (prop === "name" && value === "") {
          draft[type].title = "";
        }
      })
    );
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
      <div className="flex flex-col items-center w-full gap-4">
        <div className="grid gap-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4">
            <Heading level="h5" className="col-start-2 col-span-3">
              {t("strings:Puheenjohtaja")}
            </Heading>
            <Label htmlFor="presiding-name" className="text-right">
              {t("strings:Nimi")}
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
            <Label className="text-right">{t("strings:Virkanimike")}</Label>
            <ComboCreate
              className="col-span-3"
              options={data.court}
              disabled={
                isPending ||
                isFetching ||
                !values.presiding ||
                values.presiding.name === ""
              }
              value={values.presiding?.title ?? ""}
              onChange={(currentValue) =>
                handleChange("presiding", "title", currentValue)
              }
              placeholder={t("strings:Kirjoita tai valitse...")}
              placeholderDisabled={t("strings:Valitse edeltävä")}
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
              {t("strings:Nimi")}
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
            <Label className="text-right">{t("strings:Virkanimike")}</Label>
            <ComboCreate
              className="col-span-3"
              options={data.court}
              disabled={
                isPending ||
                isFetching ||
                !values.secretary ||
                values.secretary.name === ""
              }
              value={values.secretary?.title ?? ""}
              onChange={(currentValue) => {
                handleChange("secretary", "title", currentValue);
              }}
              placeholder={t("strings:Kirjoita tai valitse...")}
              placeholderDisabled={t("strings:Valitse edeltävä")}
            />
          </div>
        </div>
      </div>
    );
  }
}
