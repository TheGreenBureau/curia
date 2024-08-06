import { QUERY_KEYS } from "@common/queryKeys";
import { CourtInfo } from "@components/CourtInfo";
import { SideMenu } from "@components/SideMenu";
import { TopMenu } from "@components/TopMenu";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Defaults } from "config";
import { Case } from "data/Case";
import { Listing } from "data/Listing";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import "./listingView.scss";
import {
  SyButton,
  SyDatepicker,
  SyLucide,
  SyModal,
} from "@purplebureau/sy-react";
import { OfficerInfo } from "@components/OfficerInfo";
import { ListingTable } from "./ListingTable";

type ListingViewProps = {
  currentListing: Listing;
};

export function ListingView({ currentListing }: ListingViewProps) {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [date, setDate] = useState<Date | null>(currentListing.date);

  const [selections, setSelections] = useState<Defaults>({
    court: currentListing.court,
    office: currentListing.office,
    department: currentListing.department,
    room: currentListing.room,
    presiding: null,
    secretary: null,
    break: null,
  });

  const { data: defaults } = useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.getDefaults,
  });

  useEffect(() => {
    if (defaults) {
      setSelections({
        ...selections,
        presiding: defaults.presiding,
        secretary: defaults.secretary,
        break: defaults.break,
      });
    }
  }, [defaults]);

  const [cases, setCases] = useState<Case[]>(currentListing.cases ?? []);

  const { data: court } = useQuery({
    queryKey: [QUERY_KEYS.getCourt, selections],
    queryFn: async () => await window.api.getCourt(selections.court?.id),
    placeholderData: keepPreviousData,
  });

  const { mutate: updateListing } = useMutation({
    mutationFn: window.api.updateDatabase,
  });

  const { t } = useTranslation();

  return (
    <div>
      <TopMenu
        court={court}
        room={selections.room}
        date={date}
        unsavedChanges={unsavedChanges}
        onSaveChanges={() => {
          updateListing({
            id: currentListing.id,
            creationDate: currentListing.creationDate,
            date: date,
            cases: cases,
            ...selections,
          });
          setUnsavedChanges(false);
        }}
      />
      <div className="listing-content">
        <div className="row">
          <h2>{t("listings:listingViewCourt")}</h2>
        </div>
        <div className="row">
          <div className="column">
            <CourtInfo
              showTitle={false}
              courtId={selections?.court?.id ?? null}
              defaults={selections}
              onChange={(values) => {
                setUnsavedChanges(true);
                setSelections({
                  ...selections,
                  ...values,
                });
              }}
            />
            <SyDatepicker
              date={date}
              onChange={(date) => {
                setDate(date);
                setUnsavedChanges(true);
              }}
              buttonStyle={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
      <div className="listing-content">
        <ListingTable cases={cases} />
      </div>
    </div>
  );
}
