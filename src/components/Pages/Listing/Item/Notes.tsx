import { Heading } from "@/components/ui/headings";
import { Col } from "@/components/ui/rowcol";
import { Textarea } from "@/components/ui/textarea";
import type { UseCaseValues } from "@/hooks/useCases";
import { ReactNode } from "react";

type NotesProps = UseCaseValues & {
  className?: string;
  heading?: ReactNode;
};

export function Notes({
  className,
  heading,
  currentCase,
  updateCase,
  saveCase,
}: NotesProps) {
  return (
    <Col className={className}>
      {heading && (
        <Heading level="h4" className="m-0">
          {heading}
        </Heading>
      )}
      <Textarea
        value={currentCase.notes}
        onChange={(e) =>
          updateCase({
            ...currentCase,
            notes: e.target.value,
          })
        }
        onBlur={() => saveCase()}
      />
    </Col>
  );
}
