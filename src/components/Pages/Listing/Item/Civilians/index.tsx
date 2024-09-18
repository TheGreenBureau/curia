import { Heading } from "@/components/ui/headings";
import { Col, Row } from "@/components/ui/rowcol";
import { Case } from "@/types/data/case";
import { ReactNode } from "react";
import { CivilianSheet } from "@/components/Pages/Listing/Item/Civilians/CivilianSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CivilianList } from "@/components/Pages/Listing/Item/Civilians/CivilianList";

type CiviliansProps = {
  currentCase: Case;
  heading?: ReactNode;
  className?: string;
  newCivilianTrigger?: ReactNode;
};

export function Civilians({
  currentCase,
  heading,
  className,
  newCivilianTrigger,
}: CiviliansProps) {
  const { t } = useTranslation();

  return (
    <Col className={className}>
      <Row>
        {heading && (
          <Heading level="h4" className="m-0">
            {heading}
          </Heading>
        )}
        <CivilianSheet
          getCivilian={() => {
            return {
              id: "",
              name: "",
              type: "defendant",
            };
          }}
          currentCase={currentCase}
        >
          {newCivilianTrigger ? (
            newCivilianTrigger
          ) : (
            <Button size="icon" className="h-6 w-6" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CivilianSheet>
      </Row>
      {currentCase.civilians.length === 0 ? (
        <p className="text-muted-foreground min-w-[15.75rem] max-w-48">
          {t("Ei henkilöitä")}
        </p>
      ) : (
        <CivilianList currentCase={currentCase} />
      )}
    </Col>
  );
}
