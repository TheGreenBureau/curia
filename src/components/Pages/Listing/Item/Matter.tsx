import { Col, Row } from "@/components/ui/rowcol";
import { Heading } from "@/components/ui/headings";
import { cn } from "@/lib/utils";
import type { UseCaseValues } from "@/hooks/useCases";
import { ReactNode } from "react";
import { ShieldAlert, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ComboCreateCrime } from "@/components/ui/combocreate";

type MatterProps = UseCaseValues & {
  className?: string;
  heading?: ReactNode;
};

export function Matter({
  className,
  heading,
  currentCase,
  updateCase,
  saveCase,
}: MatterProps) {
  const { t } = useTranslation();

  return (
    <Col className={className}>
      {heading && (
        <Row
          className={cn(
            "items-center gap-2",
            currentCase.confidential && "text-rose-500"
          )}
        >
          <Heading level="h4" className="m-0 transition-colors duration-100">
            {heading}
          </Heading>
          {currentCase.confidential ? (
            <ShieldAlert
              className="h-4 w-4 cursor-pointer hover:opacity-80"
              onClick={() => {
                saveCase({
                  ...currentCase,
                  confidential: false,
                });
              }}
            />
          ) : (
            <ShieldOff
              className="h-4 w-4 cursor-pointer hover:opacity-80"
              onClick={() => {
                console.log("Clicked");
                saveCase({
                  ...currentCase,
                  confidential: true,
                });
              }}
            />
          )}
          <Heading
            level="h4"
            className={cn(
              "m-0 uppercase transition-transform duration-100 scale-0 text-rose-500",
              currentCase.confidential && "scale-100"
            )}
          >
            {t("strings:Salainen")}
          </Heading>
        </Row>
      )}
      <ComboCreateCrime
        className={cn(
          "text-lg font-firasans uppercase tracking-tight font-medium w-64",
          currentCase.matter === "" && "border-rose-500"
        )}
        value={currentCase.matter}
        onChange={(value) => {
          saveCase({
            ...currentCase,
            matter: value,
          });
        }}
        placeholder={t("strings:Kirjoita tai valitse...")}
      />
    </Col>
  );
}
