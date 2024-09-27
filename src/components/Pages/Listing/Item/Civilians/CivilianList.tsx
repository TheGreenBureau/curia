import { Civilian } from "@/types/data/persons";
import { produce } from "immer";
import { Col, Row } from "@/components/ui/rowcol";
import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/data/case";
import { CivilianSheet } from "@/components/Pages/Listing/Item/Civilians/CivilianSheet";
import { useResources } from "@/hooks/useResources";
import { sortCivilians } from "@/lib/dataFormat";
import { useResolvedLanguage } from "@/hooks/queries";

type CivilianListProps = {
  currentCase: Case;
};

export function CivilianList({ currentCase }: CivilianListProps) {
  const lang = useResolvedLanguage();

  const sortedCivilians = produce(currentCase.civilians, (draft) =>
    draft.sort((a, b) => sortCivilians(a, b, lang))
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
  const resources = useResources();

  return (
    <Row className="gap-3">
      <Col className="w-12 items-end">
        {resources.isSuccess && (
          <Badge variant={civilian.type} className="m-0 w-12 justify-center">
            {resources.data.positionAbbreviations[`${civilian.type}_abr`] ??
              "???"}
          </Badge>
        )}
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
