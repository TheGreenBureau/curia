import { ListingCore } from "data/Listing";
import { useTranslation } from "react-i18next";
import { SyButton, SyLucide, SyLink, SyVr } from "@purplebureau/sy-react";
import { useRecents } from "../../../hooks/useRecents";
import { clsx } from "clsx";
import { formattedListingName } from "../../../utils/listings";

type WelcomeBaseViewProps = {
  mount: boolean;
  onClickNew: () => void;
  onClickOpen: () => void;
  onClickRecent: (db: ListingCore) => Promise<void>;
};

export function WelcomeBaseView({
  mount,
  onClickNew,
  onClickOpen,
  onClickRecent,
}: WelcomeBaseViewProps) {
  const recents = useRecents();
  const { t } = useTranslation();

  return (
    <div className={clsx("baseview-container", mount && "mount")}>
      <p>{t("welcome:introduction")}</p>
      <div className={"button-container"}>
        <SyButton
          className={"button"}
          style={{ width: "100%" }}
          onClick={onClickNew}
        >
          <div className={"icon-text"}>
            <SyLucide name="square-plus" />
            {t("welcome:createListing")}
          </div>
        </SyButton>
        <SyButton
          className={"button"}
          style={{ width: "100%" }}
          onClick={onClickOpen}
        >
          <div className={"icon-text"}>
            <SyLucide name="folder-open" />
            {t("welcome:openListing")}
          </div>
        </SyButton>
      </div>
      <h4>{t("welcome:recentlyOpened")}</h4>
      {recents.length === 0 && <p>{t("welcome:noRecentListings")}</p>}
      {recents.length > 0 && (
        <div className={"recent-list"}>
          {recents.map((r) => (
            <SyLink key={r.id} onClick={() => onClickRecent(r)}>
              {formattedListingName(r, "day")}
            </SyLink>
          ))}
        </div>
      )}
    </div>
  );
}
