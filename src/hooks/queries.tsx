import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const useResolvedLanguage = () => {
  const { i18n } = useTranslation();

  return i18n.resolvedLanguage === "sv" ? "sv" : "fi";
};

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
