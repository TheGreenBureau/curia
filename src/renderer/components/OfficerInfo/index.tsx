import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { useTranslation } from "react-i18next";
import { useDropdown } from "@hooks/useDropdown";
import { SyDropdown, SyTextbox } from "@purplebureau/sy-react";
import { useEffect, useState } from "react";
import { Defaults } from "config";
import { useTextbox } from "@hooks/useTextbox";
import { Officer } from "data/Persons";
import { v4 as uuidv4 } from "uuid";

type OfficerInfoValues = {
  presiding: Officer | null;
  secretary: Officer | null;
};

type OfficerInfoProps = {
  onChange: (values: OfficerInfoValues) => void;
  defaults?: Defaults;
};

export function OfficerInfo({ onChange, defaults }: OfficerInfoProps) {
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

  const [presiding, setPresiding] = useState<Officer | null>(
    defaults?.presiding ?? null
  );
  const [secretary, setSecretary] = useState<Officer | null>(
    defaults?.secretary ?? null
  );

  const courtTitles = titleOptions?.courtTitles ?? [];

  useEffect(() => {
    setPresidingName(defaults?.presiding?.name ?? "");
    setSecretaryName(defaults?.secretary?.name ?? "");
    setPresidingTitle(defaults?.presiding?.title ?? null);
    setSecretaryTitle(defaults?.secretary?.title ?? null);
    setPresiding(defaults?.presiding ?? null);
    setSecretary(defaults?.secretary ?? null);
  }, [defaults]);

  const {
    text: presidingName,
    handleChange: presidingNameChange,
    handleBlur: presidingNameBlur,
    setValue: setPresidingName,
  } = useTextbox({
    opts: {
      onBlurMutator: (value) => {
        const pres: Officer = {
          type: "presiding",
          id: presiding?.id ?? uuidv4(),
          name: value,
          title: presiding?.title ?? null,
        };
        setPresiding(pres);
        onChange({
          presiding: pres,
          secretary: secretary,
        });
      },
    },
  });

  const {
    text: secretaryName,
    handleChange: secretaryNameChange,
    handleBlur: secretaryNameBlur,
    setValue: setSecretaryName,
  } = useTextbox({
    opts: {
      onBlurMutator: (value) => {
        const secr: Officer = {
          type: "secretary",
          id: secretary?.id ?? uuidv4(),
          name: value,
          title: secretary?.title ?? null,
        };
        setSecretary(secr);
        onChange({
          presiding: presiding,
          secretary: secr,
        });
      },
    },
  });

  const {
    text: presidingTitleText,
    handleChange: presidingTitleChange,
    handleBlur: presidingTitleBlur,
    setValue: setPresidingTitle,
  } = useDropdown({
    opts: {
      onBlurMutator: (selection) => {
        const pres: Officer = {
          type: "presiding",
          id: presiding?.id ?? uuidv4(),
          name: presiding?.name ?? "",
          title: selection,
        };

        setPresiding(pres);

        onChange({
          presiding: pres,
          secretary: secretary,
        });
      },
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
      onBlurMutator: (selected) => {
        const secr: Officer = {
          type: "secretary",
          id: secretary?.id ?? uuidv4(),
          name: secretary?.name ?? "",
          title: selected,
        };

        setSecretary(secr);

        onChange({
          presiding: presiding,
          secretary: secr,
        });
      },
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
