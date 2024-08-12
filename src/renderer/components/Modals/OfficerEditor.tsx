import { QUERY_KEYS } from "@common/queryKeys";
import { SyDropdown, SyTextbox } from "@purplebureau/sy-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Officer, OfficerType } from "data/Persons";
import { useTextbox } from "@hooks/useTextbox";
import { useDropdown } from "@hooks/useDropdown";
import { useTranslation } from "react-i18next";
import { getOfficerPositionsAsOptions } from "@common/positions/query";
import i18next from "i18next";
import { useCallback, useEffect, useState } from "react";

export type OfficerEditorProps = {
  officer: Officer;
  updateOfficer: (officer: Officer) => void;
};

export function OfficerEditor({ officer, updateOfficer }: OfficerEditorProps) {
  const [officerState, setOfficerState] = useState(officer);

  const officerTypes = getOfficerPositionsAsOptions(i18next.resolvedLanguage);

  useEffect(() => {
    setNameValue(officerState.name);
    setTitleValue(officerState.title ?? null);
    setTypeValue(officerTypes.find((t) => t.id === officerState.type));
    updateOfficer(officerState);
  }, [officerState]);

  const {
    data: titleOptions,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.titleOptions, officerState.type],
    queryFn: window.api.getTitleOptions,
    placeholderData: keepPreviousData,
  });

  const getTitles = useCallback(
    (type: OfficerType) => {
      return type === "prosecutor"
        ? titleOptions?.prosecutorTitles ?? []
        : titleOptions?.courtTitles ?? [];
    },
    [titleOptions]
  );

  const replaceOfficerProp = <K extends keyof Officer>(
    key: K,
    value: Officer[K]
  ): Officer => {
    return {
      ...officerState,
      [key]: value,
    };
  };

  const {
    text: name,
    handleChange: handleNameChange,
    handleBlur: handleNameBlur,
    setValue: setNameValue,
  } = useTextbox({
    opts: {
      onChangeMutator: (value) =>
        setOfficerState(replaceOfficerProp("name", value)),
    },
  });

  const {
    text: title,
    handleChange: handleTitleChange,
    handleBlur: handleTitleBlur,
    setValue: setTitleValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selected) =>
        setOfficerState(replaceOfficerProp("title", selected)),
      allowCustomText: true,
    },
  });

  const {
    text: type,
    handleChange: handleTypeChange,
    handleBlur: handleTypeBlur,
    setValue: setTypeValue,
  } = useDropdown({
    opts: {
      onBlurMutator: (selected) => {
        const updated = replaceOfficerProp("type", selected.id as OfficerType);
        if (getTitles(officerState.type) !== getTitles(updated.type)) {
          updated.title = undefined;
        }
        setOfficerState(updated);
      },
    },
  });

  const { t } = useTranslation();

  return (
    <div>
      <h4>{t("listings:Nimi")}</h4>
      <SyTextbox
        value={name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        error={name === "" && t("listings:Nimi_on_pakollinen_tieto")}
      />
      <h4>{t("listings:Asema")}</h4>
      <SyDropdown
        options={officerTypes}
        value={type}
        containerStyle={{ width: "100%" }}
        onChange={handleTypeChange}
        onBlur={handleTypeBlur}
      />
      <h4>{t("listings:Virkanimike")}</h4>
      <SyDropdown
        options={getTitles(officerState.type)}
        value={title}
        containerStyle={{ width: "100%" }}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        loading={isPending || isFetching}
        error={isError && "!"}
      />
    </div>
  );
}
