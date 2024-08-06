import { SyButton } from "@purplebureau/sy-react";
import "./sideMenu.scss";
import { useTranslation } from "react-i18next";

export function SideMenu() {
  const { t } = useTranslation();

  return (
    <div className="side-menu">
      <div className="section">
        <SyButton variant="flat" colors="secondary" className="section-button">
          {t("tabs:session")}
        </SyButton>
      </div>
      <div className="section">
        <SyButton variant="flat" colors="secondary" className="section-button">
          {t("tabs:cases")}
        </SyButton>
      </div>
    </div>
  );
}
