import { Col } from "@/components/ui/rowcol";
import { Heading } from "@/components/ui/headings";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { UseCaseValues } from "@/hooks/useCases";
import { ReactNode } from "react";

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
  return (
    <Col className={className}>
      {heading && (
        <Heading level="h4" className="m-0">
          {heading}
        </Heading>
      )}
      <Input
        className={cn(
          "text-lg font-firasans leading-none tracking-tight font-medium transition-all duration-200 outline-none text-ellipsis w-64",
          currentCase.matter === "" && "border-rose-500"
        )}
        value={currentCase.matter.toUpperCase()}
        onChange={(e) => {
          updateCase({
            ...currentCase,
            matter: e.target.value,
          });
        }}
        onClear={() =>
          updateCase({
            ...currentCase,
            matter: "",
          })
        }
        onBlur={() => saveCase()}
      />
    </Col>
  );
}
