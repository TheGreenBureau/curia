import { OfficerModal } from "app/modals";
import { useTranslation } from "react-i18next";

type OfficerModalHeaderProps = {
  modal: OfficerModal;
};

export function OfficerHeader({ modal }: OfficerModalHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <h3>{`Asia ${modal.caseIndex + 1}`}</h3>
        <h2>|</h2>
        <h3>{`${
          modal.matter !== "" ? modal.matter : t("listings:Ei_asianimikettä")
        }`}</h3>
        <h2>|</h2>
        <h3>{`${
          modal.caseNumber !== ""
            ? modal.caseNumber
            : t("listings:Ei_asianumeroa")
        }`}</h3>
      </div>
      <hr />
      <h4>
        {modal.editType === "add"
          ? t("listings:Lisää_uusi_virkamies")
          : t("listings:Muokkaa_virkamiestä")}
      </h4>
    </>
  );
}
