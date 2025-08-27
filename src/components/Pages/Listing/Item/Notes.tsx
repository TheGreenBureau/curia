import { Heading } from "@/components/ui/headings";
import { Col, Row } from "@/components/ui/rowcol";
import { Textarea } from "@/components/ui/textarea";
import type { UseCaseValues } from "@/hooks/useCases";
import { NotePublicity, notePublicityTypes } from "@/types/data/case";
import { ReactNode } from "react";
import { PublicityButton } from "@/components/Pages/Listing/PublicityButton";

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
  const publicityStatus: NotePublicity = currentCase.notePublicity ?? "private";

  const onPublicityClick = () => {
    const pubIndex = notePublicityTypes.indexOf(publicityStatus);

    if (pubIndex === -1 || pubIndex === notePublicityTypes.length - 1) {
      saveCase({
        ...currentCase,
        notePublicity: "private",
      });
      return;
    }

    saveCase({
      ...currentCase,
      notePublicity: notePublicityTypes[pubIndex + 1],
    });
  };

  return (
    <Col className={className}>
      <Row>
        {heading && (
          <Heading level="h4" className="m-0 select-none">
            {heading}
          </Heading>
        )}
        <PublicityButton
          publicity={publicityStatus}
          onClick={onPublicityClick}
        />
      </Row>
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
