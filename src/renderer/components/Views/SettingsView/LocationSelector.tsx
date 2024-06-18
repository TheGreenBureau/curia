import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { useTranslation } from "react-i18next";
import "./settings.scss";
import { SyButton, SyTextbox } from "@purplebureau/sy-react";

export function LocationSelector() {
  const queryClient = useQueryClient();

  const {
    data: locationResult,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.listingsLocation],
    queryFn: window.api.getDatabaseLocation,
  });

  const { mutate: chooseListingLocation } = useMutation({
    mutationFn: window.api.chooseDatabaseLocation,
    onSuccess: async () => {
      await window.api.refreshDatabases();
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listingsLocation],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listListings],
      });
    },
  });

  const { mutate: setListingLocationToDefault } = useMutation({
    mutationFn: window.api.setDatabaseDefaultLocation,
    onSuccess: async () => {
      await window.api.refreshDatabases();
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listingsLocation],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listListings],
      });
    },
  });

  const { t } = useTranslation();

  return (
    <>
      <h3>{t("settings:listingsLocationTitle")}</h3>
      <div className={"settings-section"}>
        <p>{t("settings:listingsLocationDescription")}</p>
        <SyTextbox
          value={
            locationResult?.isDefault
              ? t("settings:locationDefault")
              : locationResult?.dbLocation ?? ""
          }
          readonly
          disabled
          loading={isPending || isFetching}
          error={isError && "!"}
        />
        <div className={"settings-row"}>
          <SyButton
            style={{ width: "100%" }}
            className={"row-item"}
            onClick={() => chooseListingLocation()}
          >
            {t("settings:chooseLocation")}
          </SyButton>
          <SyButton
            style={{ width: "100%" }}
            className={"row-item"}
            onClick={() => setListingLocationToDefault()}
            disabled={locationResult?.isDefault ?? true}
          >
            {t("settings:chooseDefaultLocation")}
          </SyButton>
        </div>
      </div>
    </>
  );
}
