import { QUERY_KEYS } from "@common/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCurrentListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: window.api.updateDatabase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
    },
  });
};
