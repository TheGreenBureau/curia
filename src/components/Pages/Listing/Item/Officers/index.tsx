import { Heading } from "@/components/ui/headings";
import { Col, Row } from "@/components/ui/rowcol";
import { Case } from "@/types/data/case";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OfficerSheet } from "@/components/Pages/Listing/Item/Officers/OfficerSheet";
import { OfficerList } from "@/components/Pages/Listing/Item/Officers/OfficerList";

type OfficersProps = {
  currentCase: Case;
  heading?: ReactNode;
  className?: string;
  newOfficerTrigger?: ReactNode;
};

export function Officers({
  currentCase,
  heading,
  className,
  newOfficerTrigger,
}: OfficersProps) {
  const { t } = useTranslation();

  return (
    <Col className={className}>
      <Row>
        {heading && (
          <Heading level="h4" className="m-0">
            {heading}
          </Heading>
        )}
        <OfficerSheet
          getOfficer={() => {
            return {
              id: "",
              name: "",
              title: "",
              type: "presiding",
            };
          }}
          currentCase={currentCase}
        >
          {newOfficerTrigger ? (
            newOfficerTrigger
          ) : (
            <Button size="icon" className="h-6 w-6" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </OfficerSheet>
      </Row>
      {currentCase.officers.length === 0 ? (
        <p className="text-muted-foreground min-w-[15.75rem] max-w-48">
          {t("strings:Ei henkilöitä")}
        </p>
      ) : (
        <OfficerList currentCase={currentCase} />
      )}
    </Col>
  );
}
