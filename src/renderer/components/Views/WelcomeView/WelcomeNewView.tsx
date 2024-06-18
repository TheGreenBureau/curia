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
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";

type WelcomeNewViewProps = {
  onClickBack: () => void;
};

export function WelcomeNewView({ onClickBack }: WelcomeNewViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [court, setCourt] = useState<DropdownOption | null>(null);
  const [office, setOffice] = useState<DropdownOption | null>(null);
  const [department, setDepartment] = useState<DropdownOption | null>(null);
  const [room, setRoom] = useState<DropdownOption | null>(null);

  const queryClient = useQueryClient();

  const { data: defaults } = useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.getDefaults,
  });

  useEffect(() => {
    setCourt(defaults?.court ?? null);
    setOffice(defaults?.office ?? null);
    setDepartment(defaults?.department ?? null);
    setRoom(defaults?.room ?? null);
  }, [defaults]);

  const { mutate: createListing } = useMutation({
    mutationFn: window.api.createDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentListing] });
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
      court: court,
      office: office,
      department: department,
      room: room,
      break: defaults?.break ? defaults.break : undefined,
    };

    createListing(newListing);
  };

  return (
    <div className={clsx("newview-container", "mount")}>
      <p>{t("welcome:newDescription")}</p>
      <>
        <div className={"choices-container"}>
          <CourtInfo
            courtId={court?.id ?? null}
            defaults={defaults}
            onCourtSelect={(selected) => {
              setCourt(selected);
              setOffice(null);
              setDepartment(null);
              setRoom(null);
            }}
            onOfficeSelect={(selected) => setOffice(selected)}
            onDepartmentSelect={(selected) => setDepartment(selected)}
            onRoomSelect={(selected) => setRoom(selected)}
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
          disabled={Boolean(!court || !office || !department || !room)}
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
