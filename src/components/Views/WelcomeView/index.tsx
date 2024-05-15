import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ListingCore } from "data/Listing";
import { WelcomeBaseView } from "./WelcomeBaseView";
import { WelcomeOpenView } from "./WelcomeOpenView";
import { WelcomeNewView } from "./WelcomeNewView";
import { SettingsView } from "../SettingsView";
import { SyLucide, SyModal } from "@purplebureau/sy-react";
import { IconButton } from "../../IconButton";
import { useRecents } from "../../../hooks/useRecents";
import { clsx } from "clsx";
import { CuriaLogo } from "../../CuriaLogo";
import "./welcome.scss";

type WelcomeProps = {
  onCreateListing: (date: Date, courtId: string) => Promise<void>;
  onOpenListing: (core: ListingCore) => Promise<void>;
};

export function Welcome({ onCreateListing, onOpenListing }: WelcomeProps) {
  const recents = useRecents();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<"base" | "open" | "new" | undefined>();

  const { t } = useTranslation();

  const handleOpenListing = async (db: ListingCore) => {
    setView("base");
    await onOpenListing(db);
  };

  const handleImportListing = async () => {
    const result = await window.api.importListing();

    if (typeof result === "string") {
      console.log(result);
      return;
    }

    setView("base");
    await onOpenListing(result);
  };

  const handleCreateListing = async (date: Date, courtId: string) => {
    setView("base");
    await onCreateListing(date, courtId);
  };

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
            onClickRecent={handleOpenListing}
          />
        )}
        {view === "open" && (
          <WelcomeOpenView
            onClickOpen={handleOpenListing}
            onClickImport={handleImportListing}
            onClickBack={() => setView("base")}
          />
        )}
        {view === "new" && (
          <WelcomeNewView
            onClickCreate={handleCreateListing}
            onClickBack={() => setView("base")}
          />
        )}
      </div>
    </>
  );
}
