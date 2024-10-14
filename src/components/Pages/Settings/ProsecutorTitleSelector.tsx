import { Heading } from "@/components/ui/headings";
import { Label } from "@/components/ui/label";
import { ComboCreate } from "@/components/ui/combocreate";
import { useResources } from "@/hooks/useResources";
import { optionsFromRecord } from "@/lib/dataFormat";
import { useTranslation } from "react-i18next";

type ProsecutorTitleSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProsecutorTitleSelector({
  value,
  onChange,
}: ProsecutorTitleSelectorProps) {
  const resources = useResources();

  const { t } = useTranslation();

  if (resources.isSuccess) {
    const titleOptions = optionsFromRecord(resources.data.prosecutorTitles);

    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Heading level="h5" className="col-start-2 col-span-3 mt-0">
          {t("Syyttäjä", "Syyttäjä", { count: 2 })}
        </Heading>
        <Label className="text-right">{t("Virkanimike")}</Label>
        <ComboCreate
          className="col-span-3"
          triggerClassName="col-span-3"
          options={titleOptions}
          value={value}
          onChange={(currentValue) => onChange(currentValue)}
        />
      </div>
    );
  }
}
