import { useResolvedLanguage } from "@/hooks/queries";
import fiCourts from "@/locales/fi/courts.json";
import svCourts from "@/locales/sv/courts.json";
import fiCourtTitles from "@/locales/fi/courtTitles.json";
import svCourtTitles from "@/locales/sv/courtTitles.json";
import fiProsecutorTitles from "@/locales/fi/prosecutorTitles.json";
import svProsecutorTitles from "@/locales/sv/prosecutorTitles.json";
import fiLaymanTitles from "@/locales/fi/laymanTitles.json";
import svLaymanTitles from "@/locales/sv/laymanTitles.json";
import fiCivilianPositions from "@/locales/fi/civilianPositions.json";
import svCivilianPositions from "@/locales/sv/civilianPositions.json";
import fiOfficerPositions from "@/locales/fi/officerPositions.json";
import svOfficerPositions from "@/locales/sv/officerPositions.json";
import fiSummons from "@/locales/fi/summons.json";
import svSummons from "@/locales/sv/summons.json";
import fiSummonsStatus from "@/locales/fi/summonsStatus.json";
import svSummonsStatus from "@/locales/sv/summonsStatus.json";
import fiPositionAbbreviations from "@/locales/fi/positionAbbreviations.json";
import svPositionAbbreviations from "@/locales/sv/positionAbbreviations.json";
import { useQuery } from "@tanstack/react-query";
import { AllCourts, AllCourtsSchema } from "@/types/data/court";
import { RecordSchema, RecordType } from "@/types/data/queries";
import { ZodError } from "zod";

type Lang = "fi" | "sv";

const resources = {
  courts: {
    filename: (lang: Lang) => `courts_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/courts/fi/courts.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/courts/sv/courts.json",
    local: {
      fi: fiCourts,
      sv: svCourts,
    },
  },
  courtTitles: {
    filename: (lang: Lang) => `court_titles_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/courtTitles.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/courtTitles.json",
    local: {
      fi: fiCourtTitles,
      sv: svCourtTitles,
    },
  },
  prosecutorTitles: {
    filename: (lang: Lang) => `prosecutor_titles_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/prosecutorTitles.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/prosecutorTitles.json",
    local: {
      fi: fiProsecutorTitles,
      sv: svProsecutorTitles,
    },
  },
  laymanTitles: {
    filename: (lang: Lang) => `layman_titles_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/fi/laymanTitles.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/titles/sv/laymanTitles.json",
    local: {
      fi: fiLaymanTitles,
      sv: svLaymanTitles,
    },
  },
  civilianPositions: {
    filename: (lang: Lang) => `civilian_positions_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/fi/civilianPositions.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/sv/civilianPositions.json",
    local: {
      fi: fiCivilianPositions,
      sv: svCivilianPositions,
    },
  },
  officerPositions: {
    filename: (lang: Lang) => `officer_positions_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/fi/officerPositions.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/sv/officerPositions.json",
    local: {
      fi: fiOfficerPositions,
      sv: svOfficerPositions,
    },
  },
  positionAbbreviations: {
    filename: (lang: Lang) => `position_abbreviations_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/fi/positionAbbreviations.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/positions/sv/positionAbbreviations.json",
    local: {
      fi: fiPositionAbbreviations,
      sv: svPositionAbbreviations,
    },
  },
  summons: {
    filename: (lang: Lang) => `summons_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/summons/fi/summons.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/summons/sv/summons.json",
    local: {
      fi: fiSummons,
      sv: svSummons,
    },
  },
  summonsStatus: {
    filename: (lang: Lang) => `summons_status_${lang}.json`,
    fi: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/summons/fi/summonsStatus.json",
    sv: "https://raw.githubusercontent.com/TheGreenBureau/curia-resources/main/summons/sv/summonsStatus.json",
    local: {
      fi: fiSummonsStatus,
      sv: svSummonsStatus,
    },
  },
};

const fetchCourts = async (lang: "fi" | "sv"): Promise<AllCourts> => {
  const resource = resources.courts;
  let courts: AllCourts = AllCourtsSchema.parse(resource.local[lang]);

  try {
    const data = await fetch(resource[lang]);
    courts = AllCourtsSchema.parse(await data.json());
    await window.api.saveDataFile({
      data: JSON.stringify(courts),
      filename: resource.filename(lang),
    });
  } catch (e) {
    console.log((e as ZodError).message);
    courts = AllCourtsSchema.parse(
      await window.api.loadDataFile({ filename: resource.filename(lang) })
    );
  } finally {
    return courts;
  }
};

const fetchData = async (
  lang: "fi" | "sv",
  type: keyof typeof resources
): Promise<Record<string, string>> => {
  const resource = resources[type];
  let recordData: RecordType = RecordSchema.parse(resource.local[lang]);

  try {
    const data = await fetch(resource[lang]);
    recordData = RecordSchema.parse(await data.json());
    await window.api.saveDataFile({
      data: JSON.stringify(data),
      filename: resource.filename(lang),
    });
  } catch (e) {
    console.log((e as ZodError).message);
    recordData = RecordSchema.parse(
      await window.api.loadDataFile({ filename: resource.filename(lang) })
    );
  } finally {
    return recordData;
  }
};

export function useResources() {
  const lang = useResolvedLanguage();

  const courts = useQuery({
    queryKey: ["courts", lang],
    queryFn: async () => await fetchCourts(lang),
    staleTime: Infinity,
  });

  const courtTitles = useQuery({
    queryKey: ["courtTitles", lang],
    queryFn: async () => await fetchData(lang, "courtTitles"),
    staleTime: Infinity,
  });

  const prosecutorTitles = useQuery({
    queryKey: ["prosecutorTitles", lang],
    queryFn: async () => await fetchData(lang, "prosecutorTitles"),
    staleTime: Infinity,
  });

  const laymanTitles = useQuery({
    queryKey: ["laymanTitles", lang],
    queryFn: async () => await fetchData(lang, "laymanTitles"),
    staleTime: Infinity,
  });

  const civilianPositions = useQuery({
    queryKey: ["civilianPositions", lang],
    queryFn: async () => await fetchData(lang, "civilianPositions"),
    staleTime: Infinity,
  });

  const officerPositions = useQuery({
    queryKey: ["officerPositions", lang],
    queryFn: async () => await fetchData(lang, "officerPositions"),
    staleTime: Infinity,
  });

  const positionAbbreviations = useQuery({
    queryKey: ["positionAbbreviations", lang],
    queryFn: async () => await fetchData(lang, "positionAbbreviations"),
    staleTime: Infinity,
  });

  const summons = useQuery({
    queryKey: ["summons", lang],
    queryFn: async () => await fetchData(lang, "summons"),
    staleTime: Infinity,
  });

  const summonsStatus = useQuery({
    queryKey: ["summonsStatus", lang],
    queryFn: async () => await fetchData(lang, "summonsStatus"),
    staleTime: Infinity,
  });

  const allResources = [
    courts,
    courtTitles,
    prosecutorTitles,
    laymanTitles,
    civilianPositions,
    officerPositions,
    positionAbbreviations,
    summons,
    summonsStatus,
  ];

  const isLoading = allResources.some((r) => r.isPending || r.isFetching);
  const isSuccess = allResources.every((r) => r.isSuccess);
  const isError = allResources.some((r) => r.isError);

  return {
    courts,
    courtTitles,
    prosecutorTitles,
    laymanTitles,
    civilianPositions,
    officerPositions,
    positionAbbreviations,
    summons,
    summonsStatus,
    isLoading,
    isSuccess,
    isError,
  };
}
