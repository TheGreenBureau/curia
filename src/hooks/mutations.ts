import { QUERY_KEYS } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/hooks/useStore";
import { Listing } from "@/types/data/listing";

export const useMutateCurrentListing = () => {
  const queryClient = useQueryClient();
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  return useMutation({
    mutationFn: async (data: Listing) => {
      setCurrentListing(data);
      await window.api.updateListing(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateListingsPath = (toDefault?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toDefault
      ? window.api.setDefaultListingsPath
      : window.api.chooseListingsPath,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listingsPath],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listings],
      });
    },
  });
};

export const useMutateDefaults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.setDefaults,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.defaults],
      });
    },
  });
};

export const useMutateOpenListing = () => {
  const queryClient = useQueryClient();
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  return useMutation({
    mutationFn: window.api.openListing,
    onSuccess: async (data) => {
      setCurrentListing(data);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateCreateListing = () => {
  const queryClient = useQueryClient();
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  return useMutation({
    mutationFn: window.api.createListing,
    onSuccess: async (data) => {
      setCurrentListing(data);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateDeleteListings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.deleteListings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.listings],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateImportListing = () => {
  const queryClient = useQueryClient();
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  return useMutation({
    mutationFn: window.api.importListing,
    onSuccess: async (data) => {
      setCurrentListing(data);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateOpenCSV = () => {
  const setCurrentListing = useStore((state) => state.setCurrentListing);

  return useMutation({
    mutationFn: window.api.openCSV,
    onSuccess: async (data) => {
      setCurrentListing(data.listing);
    },
  });
};
