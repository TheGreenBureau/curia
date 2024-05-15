import { useState } from "react";
import { ListingView } from "../ListingView";
import { Welcome } from "../WelcomeView";
import { Listing, ListingCore } from "data/Listing";

export function MainView() {
  const [listing, setListing] = useState<Listing | null>(null);

  const handleNew = async (date: Date, courtId: string) => {
    const result = await window.api.createListing(date, courtId);

    if (typeof result === "string") {
      console.error(result);
      return;
    }

    setListing(result);
  };

  const handleOpen = async (core: ListingCore) => {
    const result = await window.api.openListing(core.id);

    if (typeof result === "string") {
      console.error(result);
      return;
    }

    setListing(result);
  };

  const handleBack = () => {
    setListing(null);
  };

  return (
    <div>
      {listing ? (
        <ListingView listing={listing} onClickBack={handleBack} />
      ) : (
        <Welcome onCreateListing={handleNew} onOpenListing={handleOpen} />
      )}
    </div>
  );
}
