import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { useTranslation } from "react-i18next";
import { useDropdown } from "@hooks/useDropdown";
import { SyDropdown } from "@purplebureau/sy-react";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { useEffect } from "react";
import { Defaults } from "config";

type CourtInfoSelector = (selection: DropdownOption | null) => void;

type CourtInfoProps = {
  courtId: string | null;
  onCourtSelect: CourtInfoSelector;
  onOfficeSelect?: CourtInfoSelector;
  onDepartmentSelect?: CourtInfoSelector;
  onRoomSelect?: CourtInfoSelector;
  defaults?: Defaults;
};

export function CourtInfo({
  courtId,
  onCourtSelect,
  onOfficeSelect,
  onDepartmentSelect,
  onRoomSelect,
  defaults,
}: CourtInfoProps) {
  const {
    data: courtOptions,
    isPending: optionsIsPending,
    isFetching: optionsIsFetching,
    isError: optionsIsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.courtOptions, courtId],
    queryFn: async () => await window.api.getCourtOptions(courtId),
    placeholderData: keepPreviousData,
  });

  const courts = courtOptions?.courts ?? [];
  const offices = courtOptions?.offices ?? [];
  const departments = courtOptions?.departments ?? [];
  const rooms = courtOptions?.rooms ?? [];

  useEffect(() => {
    setCourtValue(defaults?.court ?? null);
    setOfficeValue(defaults?.office ?? null);
    setDepartmentValue(defaults?.department ?? null);
    setRoomValue(defaults?.room ?? null);
  }, [defaults]);

  const {
    text: courtText,
    handleChange: courtChange,
    handleBlur: courtSelect,
    setValue: setCourtValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selection: DropdownOption) => {
        onCourtSelect(selection);
        setOfficeValue(null);
        setDepartmentValue(null);
        setRoomValue(null);
      },
    },
  });

  const {
    text: officeText,
    handleChange: officeChange,
    handleBlur: officeSelect,
    setValue: setOfficeValue,
  } = useDropdown({
    opts: {
      onBlurMutator: onOfficeSelect,
    },
  });

  const {
    text: departmentText,
    handleChange: departmentChange,
    handleBlur: departmentSelect,
    setValue: setDepartmentValue,
  } = useDropdown({
    opts: {
      onBlurMutator: onDepartmentSelect,
    },
  });

  const {
    text: roomText,
    handleChange: roomChange,
    handleBlur: roomSelect,
    setValue: setRoomValue,
  } = useDropdown({
    opts: {
      onBlurMutator: onRoomSelect,
    },
  });

  const { t } = useTranslation();

  return (
    <>
      <h4>{t("settings:courtTitle")}</h4>
      <SyDropdown
        options={courts}
        value={courtText}
        placeholder={t("settings:courtNameTitle")}
        containerStyle={{ width: "100%" }}
        onChange={courtChange}
        onBlur={courtSelect}
        loading={optionsIsPending || optionsIsFetching}
        error={optionsIsError && "!"}
      />
      <SyDropdown
        options={offices}
        value={officeText}
        placeholder={t("settings:officeTitle")}
        containerStyle={{ width: "100%" }}
        onChange={officeChange}
        onBlur={officeSelect}
        loading={optionsIsPending || optionsIsFetching}
        error={optionsIsError && "!"}
      />
      <SyDropdown
        options={departments}
        value={departmentText}
        placeholder={t("settings:departmentTitle")}
        containerStyle={{ width: "100%" }}
        onChange={departmentChange}
        onBlur={departmentSelect}
        loading={optionsIsPending || optionsIsFetching}
        error={optionsIsError && "!"}
      />
      <SyDropdown
        options={rooms}
        value={roomText}
        placeholder={t("settings:roomTitle")}
        containerStyle={{ width: "100%" }}
        onChange={roomChange}
        onBlur={roomSelect}
        loading={optionsIsPending || optionsIsFetching}
        error={optionsIsError && "!"}
      />
    </>
  );
}
