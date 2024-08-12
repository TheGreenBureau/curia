import { QUERY_KEYS } from "@common/queryKeys";
import { PlaceholderDataFunction, useQuery } from "@tanstack/react-query";
import { Listing } from "data/Listing";

export const useCurrentListing = (
  placeholderData?:
    | "previous"
    | PlaceholderDataFunction<Listing, Error, Listing, "currentListing"[]>
) =>
  useQuery({
    queryKey: [QUERY_KEYS.currentListing],
    queryFn: window.api.getCurrentDatabase,
    placeholderData: !placeholderData
      ? undefined
      : placeholderData === "previous"
      ? (previous) => previous
      : placeholderData,
  });

export const useDefaults = () =>
  useQuery({
    queryKey: [QUERY_KEYS.defaults],
    queryFn: window.api.getDefaults,
  });
