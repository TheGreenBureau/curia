import { SyButton, SyLucide, SyModeSwitch, SyVr } from "@purplebureau/sy-react";
import logo from "@img/curia-logo.svg";
import "./topMenu.scss";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { getOrderedDate } from "@common/dates/format";
import { Court } from "data/Court";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

type TopMenuProps = {
  court: Court;
  room: DropdownOption | null | undefined;
  date: Date | null | undefined;
};

export function TopMenu({ court, room, date }: TopMenuProps) {
  const queryClient = useQueryClient();

  const { mutate: deselectListing } = useMutation({
    mutationFn: window.api.deselectDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentListing] });
    },
  });

  const { t } = useTranslation();

  const handleLogoClick = () => {
    deselectListing();
  };

  return (
    <div className={"top-menu"}>
      <img src={logo} className={"main-logo"} onClick={handleLogoClick} />
      <h1 style={{ marginLeft: "1rem" }}>Curia</h1>
      <div className="vr"></div>
      <div className={"title-container"}>
        <h1 className="title-small">
          {court?.abbreviation ?? t("listings:noCourt")}
        </h1>
        <h1 className="title-small">|</h1>
        <h1 className="title-small">{room?.content ?? t("listings:noRoom")}</h1>
        <h1 className="title-small">|</h1>
        <h1 className="title-small">
          {date ? getOrderedDate(date) : t("listings:noDate")}
        </h1>
      </div>
      <div className="sections-container">
        <SyButton
          className="section-button"
          variant="flat"
          style={{ color: "var(--sy-text-color)" }}
        >
          <SyLucide name="eye" />
          {t("listings:listingViewPreview")}
        </SyButton>
        <SyButton
          className="section-button"
          variant="flat"
          style={{ color: "var(--sy-text-color)" }}
        >
          <SyLucide name="download" />
          {t("listings:listingViewExport")}
        </SyButton>
      </div>
      <div className={"theme-container"}>
        <SyModeSwitch />
      </div>
    </div>
  );
}
