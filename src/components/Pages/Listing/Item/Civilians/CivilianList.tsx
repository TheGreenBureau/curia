import { Civilian } from "@/types/data/persons";
import { produce } from "immer";
import { Col, Row } from "@/components/ui/rowcol";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/data/case";
import { CivilianSheet } from "@/components/Pages/Listing/Item/Civilians/CivilianSheet";

type CivilianListProps = {
  currentCase: Case;
};

const sortCivilians = (a: Civilian, b: Civilian) => {
  if (a.type === b.type) {
    return 0;
  }

  switch (a.type) {
    case "defendant":
      return -1;
    case "plaintiff":
      switch (b.type) {
        case "defendant":
          return 1;
        default:
          return -1;
      }
    case "injured":
      switch (b.type) {
        case "defendant":
        case "plaintiff":
          return 1;
        default:
          return -1;
      }
    case "witness":
      switch (b.type) {
        case "expert":
          return -1;
        default:
          return 1;
      }
    default:
      return 1;
  }
};

export function CivilianList({ currentCase }: CivilianListProps) {
  const sortedCivilians = produce(currentCase.civilians, (draft) =>
    draft.sort(sortCivilians)
  );

  return (
    <Col className="gap-2">
      {sortedCivilians.map((civilian) => (
        <CivilianItem
          key={civilian.id}
          civilian={civilian}
          currentCase={currentCase}
        />
      ))}
    </Col>
  );
}

type CivilianItemProps = {
  civilian: Civilian;
  currentCase: Case;
};

export function CivilianItem({ civilian, currentCase }: CivilianItemProps) {
  const { t } = useTranslation();

  return (
    <Row className="gap-3">
      <Col className="w-12 items-end">
        <Badge variant={civilian.type} className="m-0 w-12 justify-center">
          {t(`positionAbbreviations:${civilian.type}_abr`)}
        </Badge>
      </Col>
      <Col>
        <CivilianSheet getCivilian={() => civilian} currentCase={currentCase}>
          <div className="cursor-pointer transition-all duration-200 hover:opacity-80 min-w-48 max-w-48 overflow-hidden text-nowrap text-ellipsis">
            {civilian.name}
          </div>
        </CivilianSheet>
      </Col>
    </Row>
  );
}
