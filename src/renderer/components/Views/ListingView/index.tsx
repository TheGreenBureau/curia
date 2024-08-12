import { QUERY_KEYS } from "@common/queryKeys";
import { CourtInfo } from "@components/CourtInfo";
import { TopMenu } from "@components/TopMenu";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Defaults } from "config";
import { Case } from "data/Case";
import { Listing } from "data/Listing";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import "./listingView.scss";
import { SyDatepicker } from "@purplebureau/sy-react";
import { ListingTable } from "./ListingTable";
import { produce } from "immer";

type ListingViewProps = {
  currentListing: Listing;
};

export function ListingView({ currentListing }: ListingViewProps) {
  const [selections, setSelections] = useState({
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
      setSelections({
        presiding: defaults.presiding,
        secretary: defaults.secretary,
        break: defaults.break,
      });
    }
  }, [defaults]);

  const { data: court } = useQuery({
    queryKey: [QUERY_KEYS.getCourt, selections],
    queryFn: async () => await window.api.getCourt(currentListing.court?.id),
    placeholderData: keepPreviousData,
  });

  const { mutate: updateListing } = useMutation({
    mutationFn: window.api.updateDatabase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
    },
  });

  const { t } = useTranslation();

  return (
    <div>
      <TopMenu
        court={court}
        room={currentListing?.room}
        date={currentListing?.date}
      />
      <div className="listing-content">
        <div className="row">
          <h2>{t("listings:listingViewCourt")}</h2>
        </div>
        <div className="row">
          <div className="column">
            <CourtInfo
              showTitle={false}
              courtId={currentListing?.court?.id ?? null}
              values={{
                court: currentListing?.court ?? null,
                department: currentListing?.department ?? null,
                office: currentListing?.office ?? null,
                room: currentListing?.room ?? null,
              }}
              onChange={(values) => {
                if (!currentListing) return;

                updateListing(
                  produce(currentListing, (draft) => {
                    draft.cases = draft.cases ?? [];
                    draft.court = values.court;
                    draft.department = values.department;
                    draft.office = values.office;
                    draft.room = values.room;
                  })
                );
              }}
            />
            <SyDatepicker
              date={currentListing?.date}
              onChange={(date) => {
                updateListing(
                  produce(currentListing, (draft) => {
                    draft.date = date;
                  })
                );
              }}
              buttonStyle={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
      <div className="listing-content">
        <ListingTable cases={currentListing?.cases ?? []} />
      </div>
    </div>
  );
}
