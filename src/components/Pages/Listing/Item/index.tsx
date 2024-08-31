import { CSSProperties, forwardRef } from "react";
import { Case } from "@/types/data/case";
import { Card, CardContent } from "@/components/ui/card";
import { TimePicker } from "@/components/ui/date-time-picker";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Heading } from "@/components/ui/headings";
import { GripVertical, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useCase } from "@/hooks/useCases";
import { Col, Row } from "@/components/ui/rowcol";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { OfficerList } from "@/components/Pages/Listing/OfficerList";
import { Button } from "@/components/ui/button";
import { OfficerSheet } from "./OfficerSheet";
import { CivilianSheet } from "./CivilianSheet";
import { CivilianList } from "./CivilianList";
import { Textarea } from "@/components/ui/textarea";

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
    const [currentCase, updateCase, saveCase] = useCase(item);

    const { t } = useTranslation();

    return (
      <div ref={ref} style={style}>
        <Card className={cn("w-full pt-4", className)}>
          <CardContent className="relative">
            <Row>
              <Col className="w-36">
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
              <Row className="gap-4 md:gap-10 justify-start 2xl:justify-between max-w-[800px] xl:max-w-[1600px] flex-wrap w-full">
                <Col>
                  <Heading level="h4" className="m-0">
                    {t("strings:Kellonaika")}
                  </Heading>
                  <TimePicker
                    date={currentCase.time}
                    onChange={(date) => {
                      saveCase({
                        ...currentCase,
                        time: date,
                      });
                    }}
                    granularity="minute"
                  />
                </Col>
                <Col>
                  <Heading level="h4" className="m-0">
                    {t("strings:Asia")}
                  </Heading>
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
                <Col className="justify-start">
                  <Heading level="h4" className="m-0 ml-9">
                    {t("strings:Asianumerot")}
                  </Heading>
                  <Row className="items-center">
                    <Label className="hidden lg:block w-5 text-right">TI</Label>
                    <Input
                      className={cn(
                        "text-base transition-all duration-200 outline-none text-ellipsis w-52",
                        currentCase.caseNumber === "" && "border-rose-500"
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
                      <Label className="hidden lg:block w-5 text-right">
                        SJÄ
                      </Label>
                      <Input
                        className={cn(
                          "text-muted-foreground text-base transition-all duration-200 outline-none text-ellipsis w-52",
                          currentCase.prosecutorCaseNumber === "" &&
                            "border-rose-500"
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
                <Col className="justify-start">
                  <Row className="">
                    <Heading level="h4" className="m-0">
                      {t("strings:Virkamiehet")}
                    </Heading>
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
                      <Button size="icon" className="h-6 w-6" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </OfficerSheet>
                  </Row>
                  <OfficerList
                    officers={currentCase.officers}
                    currentCase={currentCase}
                  />
                </Col>

                <Col className="justify-start">
                  <Row className="">
                    <Heading level="h4" className="m-0">
                      {t("strings:Siviilit")}
                    </Heading>
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
                      <Button size="icon" className="h-6 w-6" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CivilianSheet>
                  </Row>
                  {currentCase.civilians.length === 0 ? (
                    <p className="text-muted-foreground text-center w-full">
                      {t("strings:Ei henkilöitä")}
                    </p>
                  ) : (
                    <CivilianList
                      civilians={currentCase.civilians}
                      currentCase={currentCase}
                    />
                  )}
                </Col>

                <Col className="hidden min-[1800px]:flex">
                  <Heading level="h4" className="m-0">
                    {t("strings:Huomioita")}
                  </Heading>
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
              </Row>
            </Row>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 -top-2"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
);
