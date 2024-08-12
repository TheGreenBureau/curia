import { useStore } from "@hooks/useStore";
import { SyModal } from "@purplebureau/sy-react";
import { Modal } from "app/modals";
import { OfficerFooter } from "./Footers";
import { Listing } from "data/Listing";
import { OfficerHeader } from "./Headers";
import { OfficerEditor } from "./OfficerEditor";
import "./modals.scss";

type HeaderProps = {
  modal: Modal;
};

function Header({ modal }: HeaderProps) {
  switch (modal.type) {
    case "officer":
      return <OfficerHeader modal={modal} />;
    default:
      return <h3>-----------</h3>;
  }
}

type FooterProps = {
  modal: Modal;
};

function Footer({ modal }: FooterProps) {
  switch (modal.type) {
    case "officer":
      return <OfficerFooter modal={modal} />;
    default:
      <h4>-----------</h4>;
  }
}

type ContentProps = {
  modal: Modal;
};

function Content({ modal }: ContentProps) {
  const setModal = useStore((store) => store.setModal);

  switch (modal.type) {
    case "officer":
      return (
        <OfficerEditor
          officer={modal.data}
          updateOfficer={(officer) =>
            setModal({
              ...modal,
              data: officer,
            })
          }
        />
      );
    default:
      return <h3>--------------</h3>;
  }
}

export function Modal() {
  const modal = useStore((store) => store.modal);
  const modalOpen = useStore((store) => store.modalOpen);
  const closeModal = useStore((store) => store.closeModal);
  const setModal = useStore((store) => store.setModal);

  return (
    <SyModal
      header={modal && <Header modal={modal} />}
      footer={modal && <Footer modal={modal} />}
      show={modalOpen}
      closeRequested={() => {
        closeModal();
      }}
      onHasClosed={() => setModal(null)}
    >
      <div className="modal-content">{modal && <Content modal={modal} />}</div>
    </SyModal>
  );
}
