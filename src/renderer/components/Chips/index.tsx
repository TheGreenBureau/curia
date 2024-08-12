import { Officer } from "data/Persons";
import { useTranslation } from "react-i18next";
import "./chips.scss";
import { clsx } from "clsx";

export function OfficerChip({ officer }: { officer: Officer }) {
  const { t } = useTranslation();

  return (
    <p className={clsx("officer-chip", officer.type)}>
      {t(`listings:${officer.type}_abr`)}
    </p>
  );
}
