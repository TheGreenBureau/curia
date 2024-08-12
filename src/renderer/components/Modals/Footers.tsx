import { SyButton } from "@purplebureau/sy-react";
import { useStore } from "@hooks/useStore";
import { useTranslation } from "react-i18next";
import "./footers.scss";
import { OfficerModal } from "app/modals";
import { produce } from "immer";
import { useCurrentListing } from "@hooks/queries";
import { useUpdateCurrentListing } from "@hooks/mutations";

type OfficerFooterProps = {
  modal: OfficerModal;
};

export function OfficerFooter({ modal }: OfficerFooterProps) {
  const { data: currentListing } = useCurrentListing();
  const { mutate: updateListing } = useUpdateCurrentListing();

  const closeModal = useStore((store) => store.closeModal);

  const { t } = useTranslation();

  const currentCaseIndex = currentListing.cases?.findIndex(
    (c) => c.id === modal.caseID
  );
  const currentOfficerIndex =
    currentCaseIndex !== -1
      ? currentListing.cases[currentCaseIndex].officers.findIndex(
          (o) => o.id === modal.data.id
        )
      : -1;

  const updateOfficer = () => {
    if (currentCaseIndex === -1) return;

    const updatedListing = produce(currentListing, (draft) => {
      const currentCase = draft.cases[currentCaseIndex];

      if (currentOfficerIndex === -1) {
        currentCase.officers = [...currentCase.officers, modal.data];
      } else {
        currentCase.officers[currentOfficerIndex] = modal.data;
      }
    });

    updateListing(updatedListing);
    closeModal();
  };

  const deleteOfficer = () => {
    if (currentCaseIndex === -1 || currentOfficerIndex === -1) return;

    const updatedListing = produce(currentListing, (draft) => {
      const currentCase = draft.cases[currentCaseIndex];

      currentCase.officers = currentCase.officers.filter(
        (o) => o.id !== modal.data.id
      );
    });

    updateListing(updatedListing);
    closeModal();
  };

  return (
    <div className="footer">
      {currentOfficerIndex !== -1 && (
        <SyButton colors="secondary" onClick={deleteOfficer}>
          {t("generic:Poista")}
        </SyButton>
      )}
      <SyButton onClick={updateOfficer} disabled={modal.data.name === ""}>
        {currentOfficerIndex === -1 ? t("generic:Lisää") : t("generic:OK")}
      </SyButton>
    </div>
  );
}
