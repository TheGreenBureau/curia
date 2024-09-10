import { QUERY_KEYS } from "@/lib/queryKeys";
import { Listing } from "@/types/data/listing";
import {
  keepPreviousData,
  PlaceholderDataFunction,
  useQuery,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const useResolvedLanguage = () => {
  const { i18n } = useTranslation();

  return i18n.resolvedLanguage ?? "fi";
};

export const useCurrentListing = (
  placeholderData?:
    | "keepPrevious"
    | PlaceholderDataFunction<Listing, Error, Listing, "currentListing"[]>
) =>
  useQuery({
    queryKey: [QUERY_KEYS.currentListing],
    queryFn: window.api.currentListing,
    placeholderData: !placeholderData
      ? undefined
      : placeholderData === "keepPrevious"
      ? (previous) => previous
      : placeholderData,
  });

export const useDefaults = () =>
  useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.defaults,
  });

export const useListingsPath = () =>
  useQuery({
    queryKey: [QUERY_KEYS.listingsPath],
    queryFn: window.api.listingsPath,
  });

export const useRecents = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.recents, lang],
    queryFn: window.api.recents,
  });
};

export const useListings = () =>
  useQuery({
    queryKey: [QUERY_KEYS.listings],
    queryFn: window.api.listings,
  });

export const useCourtSelections = (courtId: string | null | undefined) => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.courtOptions, lang, courtId],
    queryFn: async () => await window.api.courtSelections({ courtId, lang }),
    placeholderData: keepPreviousData,
  });
};

export const useTitles = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.titleOptions, lang],
    queryFn: async () => await window.api.titles({ lang }),
  });
};

export const useCourts = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.courts, lang],
    queryFn: async () => await window.api.courts({ lang }),
  });
};

export const useSummons = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.summons, lang],
    queryFn: async () => await window.api.summons({ lang }),
  });
};

export const useSummonsStatuses = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.summonStatus, lang],
    queryFn: async () => await window.api.summonsStatuses({ lang }),
  });
};

export const useCrimes = () => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.crimes, lang],
    queryFn: async () => await window.api.crimes({ lang }),
  });
};

export const useCrimesSearch = (query: string) => {
  const lang = useResolvedLanguage();

  return useQuery({
    queryKey: [QUERY_KEYS.crimes, lang, query],
    queryFn: async () => await window.api.crimesSearch({ lang, query }),
  });
};
