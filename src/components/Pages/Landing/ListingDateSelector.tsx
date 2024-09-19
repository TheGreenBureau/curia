import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Col, Row } from "@/components/ui/rowcol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fi } from "date-fns/locale/fi";
import { sv } from "date-fns/locale/sv";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/headings";

type TimeType = "before" | "after";

type ListingDateSelectorProps = {
  className?: string;
  onDateSelected: ({ date, type }: { date: Date; type: TimeType }) => void;
  selectionActive: boolean;
  onClearSelection: () => void;
};

export function ListingDateSelector({
  className,
  onDateSelected,
  selectionActive,
  onClearSelection,
}: ListingDateSelectorProps) {
  const [type, setType] = useState<TimeType>("before");
  const [date, setDate] = useState(new Date());

  const { t, i18n } = useTranslation();

  const handleClick = () => {
    if (selectionActive) {
      onClearSelection();
    } else {
      onDateSelected({ date, type });
    }
  };

  return (
    <Col className="w-full">
      <Heading level="h4" className={cn(selectionActive && "text-teal-500")}>
        {t("Valitse päivämäärällä")}
      </Heading>
      <Row className="items-center gap-4 w-full">
        <Select
          value={type}
          onValueChange={(value) => setType(value as "before" | "after")}
        >
          <SelectTrigger className={cn("max-w-52", className)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="before">{t("Ennen")}</SelectItem>
            <SelectItem value="after">{t("Jälkeen")}</SelectItem>
          </SelectContent>
        </Select>
        <DateTimePicker
          value={date}
          locale={i18n.resolvedLanguage === "sv" ? sv : fi}
          granularity="day"
          onChange={(date) => setDate(date ?? new Date())}
          displayFormat={{ hour24: "dd.MM.yyyy" }}
        />
        <Button variant="outline" onClick={handleClick} className="w-96">
          {selectionActive ? t("Poista valinnat") : t("Valitse")}
        </Button>
      </Row>
    </Col>
  );
}
