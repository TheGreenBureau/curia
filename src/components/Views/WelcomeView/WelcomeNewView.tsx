import {
  SyButton,
  SyLucide,
  SyDropdown,
  SyDatepicker,
} from "@purplebureau/sy-react";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import courtData from "../../../locales/fi/courts.json";
import { getCourtsAsOptions } from "../../../utils/courts";
import { useDefaults } from "../../../hooks/useDefaults";
import { IconButton } from "../../IconButton";

type WelcomeNewViewProps = {
  onClickCreate: (date: Date, courtId: string) => Promise<void>;
  onClickBack: () => void;
};

export function WelcomeNewView({
  onClickCreate,
  onClickBack,
}: WelcomeNewViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [defaults] = useDefaults();
  const [courtId, setCourtId] = useState(Object.keys(courtData)[0]);
  const { t } = useTranslation();

  useEffect(() => {
    setCourtId(defaults.courtId ?? Object.keys(courtData)[0]);
  }, [defaults]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCreateClick = async () => {
    console.log("courtId:", courtId);
    if (!selectedDate || !courtId) {
      return;
    }

    onClickCreate(selectedDate, courtId);
  };

  const courtOptions = useMemo(getCourtsAsOptions, []);

  return (
    <div className={clsx("newview-container", "mount")}>
      <p>{t("welcome:newDescription")}</p>
      <div className={"choices-container"}>
        <SyDropdown
          options={courtOptions}
          initialSelection={courtOptions.findIndex(
            (value) => value.id === courtId
          )}
          restrict="Valitse käräjäoikeus"
          onChange={(id) => setCourtId(id)}
          className="dropdown"
        />
        <SyDatepicker date={selectedDate} onChange={handleDateChange} />
      </div>
      <SyButton
        style={{ width: "100%" }}
        className={"button"}
        onClick={handleCreateClick}
      >
        {t("welcome:createButton")}
      </SyButton>
      <IconButton
        name="circle-arrow-left"
        size="2.5rem"
        style={{ marginTop: "2rem" }}
        onClick={onClickBack}
      />
    </div>
  );
}
