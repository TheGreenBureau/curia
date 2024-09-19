import { Col } from "@/components/ui/rowcol";
import { Heading } from "@/components/ui/headings";
import { TimePicker } from "@/components/ui/date-time-picker";
import { UseCaseValues } from "@/hooks/useCases";
import { ReactNode } from "react";

type TimeProps = UseCaseValues & {
  className?: string;
  heading?: ReactNode;
};

export function Time({ className, heading, currentCase, saveCase }: TimeProps) {
  return (
    <Col className={className}>
      {heading && (
        <Heading level="h4" className="m-0">
          {heading}
        </Heading>
      )}
      <TimePicker
        date={currentCase.time}
        onChange={(date) => {
          saveCase({
            ...currentCase,
            time: date ?? currentCase.time,
          });
        }}
        granularity="minute"
      />
    </Col>
  );
}
