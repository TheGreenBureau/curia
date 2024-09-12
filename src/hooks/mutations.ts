import { QUERY_KEYS } from "@/lib/queryKeys";
import { ListingDocumentProps } from "@/types/data/listing";
import {
  QueryCache,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useMutateCurrentListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.updateListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
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

  return useMutation({
    mutationFn: window.api.openListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.createListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.updateListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateDeselectListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.deselectCurrentListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
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
        queryKey: [QUERY_KEYS.currentListing],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateImportListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.importListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.recents],
      });
    },
  });
};

export const useMutateOpenCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.openCSV,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
    },
  });
};
