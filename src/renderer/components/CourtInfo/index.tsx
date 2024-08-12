import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { useTranslation } from "react-i18next";
import { useDropdown } from "@hooks/useDropdown";
import { SyDropdown } from "@purplebureau/sy-react";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { useEffect } from "react";
import { Defaults } from "config";

type CourtInfoValues = {
  court: DropdownOption | null;
  office: DropdownOption | null;
  department: DropdownOption | null;
  room: DropdownOption | null;
};

type CourtInfoProps = {
  courtId: string | null;
  onChange: (values: CourtInfoValues) => void;
  values?: CourtInfoValues;
  showTitle?: boolean;
};

export function CourtInfo({
  courtId,
  onChange,
  values,
  showTitle,
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
    setCourtValue(values?.court ?? null);
    setOfficeValue(values?.office ?? null);
    setDepartmentValue(values?.department ?? null);
    setRoomValue(values?.room ?? null);
  }, [values]);

  const {
    selected: selectedCourt,
    text: courtText,
    handleChange: courtChange,
    handleBlur: courtSelect,
    setValue: setCourtValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selection: DropdownOption) => {
        setOfficeValue(null);
        setDepartmentValue(null);
        setRoomValue(null);

        onChange({
          court: selection,
          office: null,
          department: null,
          room: null,
        });
      },
    },
  });

  const {
    selected: selectedOffice,
    text: officeText,
    handleChange: officeChange,
    handleBlur: officeSelect,
    setValue: setOfficeValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selected) => {
        onChange({
          court: selectedCourt,
          office: selected,
          department: selectedDepartment,
          room: selectedRoom,
        });
      },
    },
  });

  const {
    selected: selectedDepartment,
    text: departmentText,
    handleChange: departmentChange,
    handleBlur: departmentSelect,
    setValue: setDepartmentValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selected) => {
        onChange({
          court: selectedCourt,
          office: selectedOffice,
          department: selected,
          room: selectedRoom,
        });
      },
    },
  });

  const {
    selected: selectedRoom,
    text: roomText,
    handleChange: roomChange,
    handleBlur: roomSelect,
    setValue: setRoomValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selected) => {
        onChange({
          court: selectedCourt,
          office: selectedOffice,
          department: selectedDepartment,
          room: selected,
        });
      },
    },
  });

  const { t } = useTranslation();

  return (
    <>
      {showTitle !== false && <h4>{t("settings:courtTitle")}</h4>}
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
