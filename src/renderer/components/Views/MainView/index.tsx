import { useCurrentListing } from "@hooks/queries";
import { ListingView } from "../ListingView";
import { Welcome } from "../WelcomeView";
import { QUERY_KEYS } from "@common/queryKeys";
import { Modal } from "@components/Modals";

export function MainView() {
  const { data: currentListing, isSuccess } = useCurrentListing();

  return (
    <div>
      {currentListing && <Modal />}
      {currentListing && isSuccess ? (
        <ListingView currentListing={currentListing} />
      ) : (
        <Welcome />
      )}
    </div>
  );
}
