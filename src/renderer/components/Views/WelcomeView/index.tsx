import { useTranslation } from "react-i18next";
import { useState } from "react";
import { WelcomeBaseView } from "./WelcomeBaseView";
import { WelcomeOpenView } from "./WelcomeOpenView";
import { WelcomeNewView } from "./WelcomeNewView";
import { SettingsView } from "../SettingsView";
import { SyModal } from "@purplebureau/sy-react";
import { IconButton } from "@components/IconButton";
import { clsx } from "clsx";
import { CuriaLogo } from "@components/CuriaLogo";
import "./welcome.scss";

export function Welcome() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<"base" | "open" | "new" | undefined>();

  const { t } = useTranslation();

  return (
    <>
      <SyModal
        show={settingsOpen}
        closeRequested={() => setSettingsOpen(false)}
        header={t("welcome:settingsTitle")}
      >
        <SettingsView />
      </SyModal>
      <div className={"welcome-container"}>
        <IconButton
          name="settings"
          className={clsx(
            "configuration-button",
            view !== "base" && view !== undefined && "hidden"
          )}
          size="2rem"
          onClick={() => setSettingsOpen(true)}
        />
        <CuriaLogo className={"welcome-logo"} />
        <h2>{t("welcome:mainTitle")}</h2>
        {(view === "base" || view === undefined) && (
          <WelcomeBaseView
            mount={view === "base"}
            onClickNew={() => setView("new")}
            onClickOpen={() => setView("open")}
          />
        )}
        {view === "open" && (
          <WelcomeOpenView onClickBack={() => setView("base")} />
        )}
        {view === "new" && (
          <WelcomeNewView onClickBack={() => setView("base")} />
        )}
      </div>
    </>
  );
}
