import { Row, Col } from "@/components/ui/rowcol";
import { Heading } from "@/components/ui/headings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseCaseValues } from "@/hooks/useCases";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type CaseNumbersProps = UseCaseValues & {
  className?: string;
  heading?: ReactNode;
};

export function CaseNumbers({
  className,
  heading,
  currentCase,
  updateCase,
  saveCase,
}: CaseNumbersProps) {
  const { t } = useTranslation();

  return (
    <Col className={className}>
      {heading && (
        <Heading level="h4" className="m-0">
          {heading}
        </Heading>
      )}
      <Row className="items-center">
        {currentCase.type === "criminal" && (
          <Label className="w-5 text-right">{t("TI")}</Label>
        )}
        <Input
          className={cn(
            "text-base transition duration-200 outline-none text-ellipsis w-52",
            currentCase.caseNumber === "" && "border-rose-500",
            currentCase.type === "civil" && "w-[15.25rem]"
          )}
          value={currentCase.caseNumber}
          onChange={(e) =>
            updateCase({
              ...currentCase,
              caseNumber: e.target.value,
            })
          }
          onClear={() =>
            updateCase({
              ...currentCase,
              caseNumber: "",
            })
          }
          onBlur={() => saveCase()}
        />
      </Row>
      {currentCase.type === "criminal" && (
        <Row className="items-center">
          <Label className="w-5 text-right">{t("SJÄ")}</Label>
          <Input
            className={cn(
              "text-muted-foreground text-base transition-all duration-200 outline-none text-ellipsis w-52",
              currentCase.prosecutorCaseNumber === "" && "border-rose-500"
            )}
            value={currentCase.prosecutorCaseNumber}
            onChange={(e) =>
              updateCase({
                ...currentCase,
                prosecutorCaseNumber: e.target.value,
              })
            }
            onClear={() =>
              updateCase({
                ...currentCase,
                prosecutorCaseNumber: "",
              })
            }
            onBlur={() => saveCase()}
          />
        </Row>
      )}
    </Col>
  );
}
