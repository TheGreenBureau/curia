import { useTranslation } from "react-i18next";
import {
  SyModeSwitch,
  SyButton,
  SyTextbox,
  SyDropdown,
} from "@purplebureau/sy-react";
import { useState, useEffect } from "react";
import { useListingsLocation } from "../../../hooks/useListingsLocation";
import { useDefaults } from "../../../hooks/useDefaults";
import { useFileNameDateStart } from "../../../hooks/useFileNameDateStart";
import { clsx } from "clsx";

import "./settings.scss";

export function SettingsView() {
  const [
    listingsLocation,
    chooseLocation,
    isDefaultLocation,
    setLocationToDefault,
  ] = useListingsLocation();
  const [defaults, setDefaults] = useDefaults();
  const [fileNameDateStart, setFileNameDateStart] = useFileNameDateStart();
  const { t } = useTranslation();

  return (
    <div className={"settings"}>
      <h3>{t("settings:uiTitle")}</h3>
      <div className={"theme"}>
        <h4>{t("settings:modeTitle")}</h4>
        <SyModeSwitch />
      </div>
      <h3>{t("settings:listingsLocationTitle")}</h3>
      <div className={"listings-location"}>
        <p>{t("settings:listingsLocationDescription")}</p>
        <SyTextbox
          value={
            isDefaultLocation ? t("settings:locationDefault") : listingsLocation
          }
          readonly
          disabled
        />
        <div className={"buttons"}>
          <SyButton
            style={{ width: "100%" }}
            className={"button"}
            onClick={chooseLocation}
          >
            {t("settings:chooseLocation")}
          </SyButton>
          <SyButton
            style={{ width: "100%" }}
            className={"button"}
            onClick={setLocationToDefault}
            disabled={isDefaultLocation}
          >
            {t("settings:chooseDefaultLocation")}
          </SyButton>
        </div>
      </div>
    </div>
  );
}
