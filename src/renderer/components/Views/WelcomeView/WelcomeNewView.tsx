import { SyButton, SyDatepicker } from "@purplebureau/sy-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { IconButton } from "@components/IconButton";
import { v4 as uuidv4 } from "uuid";
import { Listing } from "data/Listing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { CourtInfo } from "@components/CourtInfo";
import { Defaults } from "config";

type WelcomeNewViewProps = {
  onClickBack: () => void;
};

export function WelcomeNewView({ onClickBack }: WelcomeNewViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selections, setSelections] = useState<Defaults>({
    court: null,
    office: null,
    department: null,
    room: null,
    presiding: null,
    secretary: null,
    break: null,
  });

  const queryClient = useQueryClient();

  const { data: defaults } = useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.getDefaults,
  });

  useEffect(() => {
    if (defaults) {
      setSelections(defaults);
    }
  }, [defaults]);

  const { mutate: createListing } = useMutation({
    mutationFn: window.api.createDatabase,
    onSuccess: async () => {
      await window.api.refreshDatabases();
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
    },
  });

  const { t } = useTranslation();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCreateClick = async () => {
    if (!selectedDate) {
      return;
    }

    const newListing: Listing = {
      id: uuidv4(),
      creationDate: new Date(),
      date: selectedDate,
      court: selections.court,
      office: selections.office,
      department: selections.department,
      room: selections.room,
      break: selections?.break ? selections.break : undefined,
    };

    createListing(newListing);
  };

  return (
    <div className={clsx("newview-container", "mount")}>
      <p>{t("welcome:newDescription")}</p>
      <>
        <div className={"choices-container"}>
          <CourtInfo
            courtId={selections?.court?.id ?? null}
            values={selections}
            onChange={(values) => {
              setSelections({
                ...selections,
                ...values,
              });
            }}
          />
          <SyDatepicker
            date={selectedDate}
            onChange={handleDateChange}
            buttonStyle={{ width: "100%" }}
            containerClassName="courtdatepicker"
          />
        </div>
        <hr style={{ width: "100%", marginTop: "1rem" }} />
        <SyButton
          style={{ width: "100%" }}
          containerStyle={{ width: "100%" }}
          disabled={Boolean(
            !selections?.court ||
              !selections?.office ||
              !selections?.department ||
              !selections?.room
          )}
          className={"button"}
          onClick={handleCreateClick}
        >
          {t("welcome:createButton")}
        </SyButton>
        <IconButton
          name="circle-arrow-left"
          size="2.5rem"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
          onClick={onClickBack}
        />
      </>
    </div>
  );
}
