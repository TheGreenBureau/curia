import { ListingView } from "../ListingView";
import { Welcome } from "../WelcomeView";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";

export function MainView() {
  const { data: currentListing, isSuccess } = useQuery({
    queryKey: [QUERY_KEYS.currentListing],
    queryFn: window.api.getCurrentDatabase,
  });

  return (
    <div>
      {currentListing && isSuccess ? (
        <ListingView currentListing={currentListing} />
      ) : (
        <Welcome />
      )}
    </div>
  );
}
