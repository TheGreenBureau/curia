import { useTranslation } from "react-i18next";
import "./settings.scss";
import { LocationSelector } from "./LocationSelector";
import { CourtInfo } from "../../CourtInfo";
import { OfficerInfo } from "@components/OfficerInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { Defaults } from "config";
import { v4 as uuidv4 } from "uuid";
import { StaffMember } from "data/Persons";

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

  const saveDefaults = <K extends keyof Defaults>(key: K, val: Defaults[K]) => {
    setDefaults({
      ...defaults,
      [key]: val,
    });
  };

  const updateOfficer = <K extends keyof StaffMember>(
    type: "presiding" | "secretary",
    key: K,
    val: StaffMember[K]
  ): StaffMember => {
    const officer: StaffMember = defaults?.[type]
      ? { ...defaults?.[type] }
      : {
          id: uuidv4(),
          name: "",
          title: null,
        };

    officer[key] = val;

    return officer;
  };

  return (
    <div className={"settings"}>
      <LocationSelector />
      <h3>{t("settings:defaultsTitle")}</h3>
      <div className={"settings-section"}>
        <p>{t("settings:defaultsDescription")}</p>
        <CourtInfo
          courtId={defaults?.court?.id ?? null}
          defaults={defaults}
          onCourtSelect={(selection) =>
            setDefaults({
              ...defaults,
              court: selection,
              office: null,
              department: null,
              room: null,
            })
          }
          onOfficeSelect={(selection) => saveDefaults("office", selection)}
          onDepartmentSelect={(selection) =>
            saveDefaults("department", selection)
          }
          onRoomSelect={(selection) => saveDefaults("room", selection)}
        />
        <OfficerInfo
          defaults={defaults}
          onPresidingNameChange={(value) => {
            const officer = updateOfficer("presiding", "name", value);
            saveDefaults("presiding", officer);
          }}
          onPresidingTitleChange={(selected) => {
            const officer = updateOfficer("presiding", "title", selected);
            saveDefaults("presiding", officer);
          }}
          onSecretaryNameChange={(value) => {
            const officer = updateOfficer("secretary", "name", value);
            saveDefaults("secretary", officer);
          }}
          onSecretaryTitleChange={(selected) => {
            const officer = updateOfficer("secretary", "title", selected);
            saveDefaults("secretary", officer);
          }}
        />
      </div>
    </div>
  );
}
