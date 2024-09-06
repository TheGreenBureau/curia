import { CSSProperties, forwardRef, useState } from "react";
import { Case } from "@/types/data/case";
import { Card, CardContent } from "@/components/ui/card";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Heading } from "@/components/ui/headings";
import {
  GripVertical,
  Plus,
  Trash,
  NotebookPen,
  User,
  Scale,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCase } from "@/hooks/useCases";
import { Col, Row } from "@/components/ui/rowcol";
import { useTranslation } from "react-i18next";
import {
  ItemMenu,
  MenuItem,
  MenuSubItem,
} from "@/components/Pages/Listing/Item/ItemMenu";
import { Notes } from "./Notes";
import { Civilians } from "@/components/Pages/Listing/Item/Civilians";
import { Officers } from "./Officers";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CaseNumbers } from "./CaseNumbers";
import { Matter } from "./Matter";
import { Time } from "./Time";
import { DeleteCaseDialog } from "./DeleteCaseDialog";

type ItemProps = {
  item: Case;
  index: number;
  style?: CSSProperties;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  className?: string;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ item, index, style, attributes, listeners, className }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const caseQuery = useCase(item);
    const { currentCase } = caseQuery;

    const { t } = useTranslation();

    return (
      <div ref={ref} style={style}>
        <Card
          className={cn(
            "w-full pt-4 transition-colors duration-100",
            currentCase?.confidential && "border-rose-500",
            className
          )}
        >
          <CardContent className="relative">
            <Row>
              <Col className="w-28">
                <Heading level="h4" className="m-0">
                  {t("strings:Nro")}
                </Heading>
                <Row className="gap-2 items-center justify-start">
                  <Heading level="h2" className="m-0">
                    {index + 1}
                  </Heading>
                  <GripVertical
                    className="cursor-grab outline-none"
                    {...attributes}
                    {...listeners}
                  />
                </Row>
              </Col>
              <Row className="gap-10 justify-start mr-10 w-full">
                <Time heading={t("strings:Kellonaika")} {...caseQuery} />

                <Matter heading={t("strings:Asia")} {...caseQuery} />

                <CaseNumbers
                  className="hidden casenumbers:flex"
                  {...caseQuery}
                  heading={
                    currentCase.type === "civil"
                      ? t("strings:Asianumero")
                      : t("strings:Asianumerot")
                  }
                />

                <Officers
                  className="hidden officers:flex"
                  currentCase={currentCase}
                  heading={t("strings:Virkamiehet")}
                />

                <Civilians
                  className="hidden civilians:flex"
                  currentCase={currentCase}
                  heading={t("strings:Siviilit")}
                />

                <Notes
                  className="hidden notes:flex"
                  heading={t("strings:Huomioita")}
                  {...caseQuery}
                />
              </Row>
            </Row>

            <ItemMenu className="absolute right-2 -top-2">
              <MenuSubItem
                icon={Hash}
                triggerContent={
                  currentCase.type === "civil"
                    ? t("strings:Asianumero")
                    : t("strings:Asianumerot")
                }
                className="casenumbers:hidden"
              >
                <CaseNumbers
                  {...caseQuery}
                  heading={
                    currentCase.type === "civil"
                      ? t("strings:Asianumero")
                      : t("strings:Asianumerot")
                  }
                />
              </MenuSubItem>
              <MenuSubItem
                icon={Scale}
                triggerContent={t("strings:Virkamiehet")}
                className="officers:hidden"
              >
                <Officers
                  currentCase={currentCase}
                  heading={t("strings:Virkamiehet")}
                />
              </MenuSubItem>
              <MenuSubItem
                icon={User}
                triggerContent={t("strings:Siviilit")}
                className="civilians:hidden"
              >
                <Civilians
                  currentCase={currentCase}
                  heading={t("strings:Siviilit")}
                />
              </MenuSubItem>
              <MenuSubItem
                icon={NotebookPen}
                triggerContent={t("strings:Huomioita")}
                className="notes:hidden"
              >
                <Notes {...caseQuery} heading={t("strings:Huomioita")} />
              </MenuSubItem>
              <DropdownMenuSeparator className="notes:hidden" />
              <MenuItem onClick={() => setDeleteDialogOpen(true)} icon={Trash}>
                {t("strings:Poista")}
              </MenuItem>
            </ItemMenu>

            {currentCase && caseQuery.listingQuery.isSuccess && (
              <DeleteCaseDialog
                currentCase={currentCase}
                currentListing={caseQuery.listingQuery.data}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);
