import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { useTranslation } from "react-i18next";
import { useDropdown } from "@hooks/useDropdown";
import { SyDropdown, SyTextbox } from "@purplebureau/sy-react";
import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { useEffect } from "react";
import { Defaults } from "config";
import { useTextbox } from "@hooks/useTextbox";

type OfficerTitleSelector = (selection: DropdownOption) => void;
type OfficerNameChange = (value: string) => void;

type OfficerInfoProps = {
  onPresidingNameChange: OfficerNameChange;
  onPresidingTitleChange: OfficerTitleSelector;
  onSecretaryNameChange: OfficerNameChange;
  onSecretaryTitleChange: OfficerTitleSelector;
  defaults?: Defaults;
};

export function OfficerInfo({
  onPresidingNameChange,
  onPresidingTitleChange,
  onSecretaryNameChange,
  onSecretaryTitleChange,
  defaults,
}: OfficerInfoProps) {
  const {
    data: titleOptions,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.titleOptions],
    queryFn: window.api.getTitleOptions,
    placeholderData: keepPreviousData,
  });

  const courtTitles = titleOptions?.courtTitles ?? [];

  useEffect(() => {
    setPresidingName(defaults?.presiding?.name ?? "");
    setSecretaryName(defaults?.secretary?.name ?? "");
    setPresidingTitle(defaults?.presiding?.title ?? null);
    setSecretaryTitle(defaults?.secretary?.title ?? null);
  }, [defaults]);

  const {
    text: presidingName,
    handleChange: presidingNameChange,
    handleBlur: presidingNameBlur,
    setValue: setPresidingName,
  } = useTextbox({
    opts: {
      onBlurMutator: onPresidingNameChange,
    },
  });

  const {
    text: secretaryName,
    handleChange: secretaryNameChange,
    handleBlur: secretaryNameBlur,
    setValue: setSecretaryName,
  } = useTextbox({
    opts: {
      onBlurMutator: onSecretaryNameChange,
    },
  });

  const {
    text: presidingTitleText,
    handleChange: presidingTitleChange,
    handleBlur: presidingTitleBlur,
    setValue: setPresidingTitle,
  } = useDropdown({
    opts: {
      onBlurMutator: onPresidingTitleChange,
      allowCustomText: true,
    },
  });

  const {
    text: secretaryTitleText,
    handleChange: secretaryTitleChange,
    handleBlur: secretaryTitleBlur,
    setValue: setSecretaryTitle,
  } = useDropdown({
    opts: {
      onBlurMutator: onSecretaryTitleChange,
      allowCustomText: true,
    },
  });

  const { t } = useTranslation();

  return (
    <>
      <h4>{t("settings:presidingTitle")}</h4>
      <SyTextbox
        value={presidingName}
        onChange={presidingNameChange}
        onBlur={presidingNameBlur}
        placeholder={t("settings:presidingDefaultNameTitle")}
      />
      <SyDropdown
        options={courtTitles ?? []}
        value={presidingTitleText}
        placeholder={t("settings:presidingDefaultTitleTitle")}
        containerStyle={{ width: "100%" }}
        onChange={presidingTitleChange}
        onBlur={presidingTitleBlur}
        loading={isPending || isFetching}
        error={isError && "!"}
      />
      <h4>{t("settings:secretaryTitle")}</h4>
      <SyTextbox
        value={secretaryName}
        onChange={secretaryNameChange}
        onBlur={secretaryNameBlur}
        placeholder={t("settings:secretaryDefaultNameTitle")}
      />
      <SyDropdown
        options={courtTitles ?? []}
        value={secretaryTitleText}
        placeholder={t("settings:secretaryDefaultNameTitle")}
        containerStyle={{ width: "100%" }}
        onChange={secretaryTitleChange}
        onBlur={secretaryTitleBlur}
        loading={isPending || isFetching}
        error={isError && "!"}
      />
    </>
  );
}
