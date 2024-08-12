import { useTranslation } from "react-i18next";
import "./settings.scss";
import { LocationSelector } from "./LocationSelector";
import { CourtInfo } from "../../CourtInfo";
import { OfficerInfo } from "@components/OfficerInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";

export function SettingsView() {
  const queryClient = useQueryClient();

  const { data: defaults } = useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.getDefaults,
  });

  const { mutate: setDefaults } = useMutation({
    mutationFn: window.api.setDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.defaults],
      });
    },
  });

  const { t } = useTranslation();

  return (
    <div className={"settings"}>
      <LocationSelector />
      <h3>{t("settings:defaultsTitle")}</h3>
      <div className={"settings-section"}>
        <p>{t("settings:defaultsDescription")}</p>
        <CourtInfo
          courtId={defaults?.court?.id ?? null}
          values={defaults}
          onChange={(values) => {
            setDefaults({
              ...defaults,
              ...values,
            });
          }}
        />
        <OfficerInfo
          defaults={defaults}
          onChange={(values) => {
            setDefaults({
              ...defaults,
              ...values,
            });
          }}
        />
      </div>
    </div>
  );
}
