import { Officer } from "@/types/data/persons";
import { produce } from "immer";
import { Col, Row } from "@/components/ui/rowcol";
import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/data/case";
import { OfficerSheet } from "./OfficerSheet";
import { useResources } from "@/hooks/useResources";
import { sortOfficers } from "@/lib/dataFormat";
import { useResolvedLanguage } from "@/hooks/queries";

type OfficerListProps = {
  currentCase: Case;
};

export function OfficerList({ currentCase }: OfficerListProps) {
  const lang = useResolvedLanguage();

  const sortedOfficers = produce(currentCase.officers, (draft) =>
    draft.sort((a, b) => sortOfficers(a, b, lang))
  );

  return (
    <Col className="gap-2">
      {sortedOfficers.map((officer) => (
        <OfficerItem
          key={officer.id}
          officer={officer}
          currentCase={currentCase}
        />
      ))}
    </Col>
  );
}

type OfficerItemProps = {
  officer: Officer;
  currentCase: Case;
};

export function OfficerItem({ officer, currentCase }: OfficerItemProps) {
  const resources = useResources();

  return (
    <Row className="gap-3">
      <Col className="w-12 items-end">
        {resources.isSuccess && (
          <Badge variant={officer.type} className="m-0 w-12 justify-center">
            {resources.data.positionAbbreviations[`${officer.type}_abr`] ??
              "???"}
          </Badge>
        )}
      </Col>
      <Col>
        <OfficerSheet getOfficer={() => officer} currentCase={currentCase}>
          <div className="cursor-pointer transition-all duration-200 hover:opacity-80 min-w-48 max-w-48 overflow-hidden text-nowrap text-ellipsis">
            {officer.name}
          </div>
        </OfficerSheet>
      </Col>
    </Row>
  );
}
