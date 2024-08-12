import { Officer } from "data/Persons";
import "./officerListing.scss";
import { OfficerChip } from "@components/Chips";
import { IconButton } from "@components/IconButton";
import { useStore } from "@hooks/useStore";
import { v4 as uuidv4 } from "uuid";

type OfficerListingItemProps = {
  officer: Officer;
  caseNumber: string;
  matter: string;
  caseID: string;
  caseIndex: number;
};

function OfficerListingItem({
  officer,
  caseNumber,
  matter,
  caseID,
  caseIndex,
}: OfficerListingItemProps) {
  const setModal = useStore((store) => store.setModal);
  const showModal = useStore((store) => store.showModal);

  const handleOfficerClick = () => {
    setModal({
      type: "officer",
      data: officer,
      caseNumber,
      matter,
      caseID,
      caseIndex,
      editType: "update",
    });

    showModal();
  };

  return (
    <div className="officer-listing-item" onClick={handleOfficerClick}>
      <OfficerChip officer={officer} />
      <p>{officer.name}</p>
    </div>
  );
}

type OfficerListingProps = {
  officers: Officer[];
  caseNumber: string;
  matter: string;
  caseID: string;
  caseIndex: number;
};

export function OfficerListing({
  officers,
  caseNumber,
  matter,
  caseID,
  caseIndex,
}: OfficerListingProps) {
  const setModal = useStore((store) => store.setModal);
  const showModal = useStore((store) => store.showModal);

  const sortedOfficers = [...officers].sort(sortOfficers);

  const handleAddOfficerClick = () => {
    const emptyOfficer: Officer = {
      id: uuidv4(),
      name: "",
      type: "member",
    };

    setModal({
      type: "officer",
      data: emptyOfficer,
      caseNumber,
      matter,
      caseID,
      caseIndex,
      editType: "add",
    });

    showModal();
  };

  return (
    <div className="officer-section">
      <IconButton
        name="plus"
        style={{ border: "2px solid var(--sy-base-10)" }}
        onClick={handleAddOfficerClick}
      />

      <div className="officer-listing">
        {sortedOfficers.map((officer) => (
          <OfficerListingItem
            officer={officer}
            caseNumber={caseNumber}
            matter={matter}
            caseID={caseID}
            caseIndex={caseIndex}
          />
        ))}
      </div>
    </div>
  );
}

const sortOfficers = (a: Officer, b: Officer) => {
  switch (a.type) {
    case "presiding":
      return -1;
    case "secretary":
      switch (b.type) {
        case "presiding":
          return 1;
        case "secretary":
          return 0;
        default:
          return -1;
      }
    case "member":
      switch (b.type) {
        case "member":
          return 0;
        case "prosecutor":
          return -1;
        default:
          return 1;
      }
    default:
      switch (b.type) {
        case "prosecutor":
          return 0;
        default:
          return 1;
      }
  }
};
