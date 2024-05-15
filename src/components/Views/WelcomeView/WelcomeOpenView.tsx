import { ListingCore } from "data/Listing";
import { useTranslation } from "react-i18next";
import { SyDropdown, SyButton, SyLucide } from "@purplebureau/sy-react";
import { useListings } from "../../../hooks/useListings";
import { clsx } from "clsx";
import { formattedListingName } from "../../../utils/listings";
import { useFileNameDateStart } from "../../../hooks/useFileNameDateStart";
import { IconButton } from "../../IconButton";

type WelcomeOpenViewProps = {
  onClickOpen: (db: ListingCore) => Promise<void>;
  onClickImport: () => Promise<void>;
  onClickBack: () => void;
};

export function WelcomeOpenView({
  onClickOpen,
  onClickImport,
  onClickBack,
}: WelcomeOpenViewProps) {
  const listings = useListings();
  const [fileNameDateStart] = useFileNameDateStart();
  const { t } = useTranslation();

  const options = listings.map((listing) => {
    return {
      id: listing.id,
      content: formattedListingName(listing, fileNameDateStart),
    };
  });

  const handleOpenSelection = async (id: string) => {
    await onClickOpen(listings.find((listing) => listing.id === id));
  };

  return (
    <div className={clsx("openview-container", "mount")}>
      <p>{t("welcome:openDescription")}</p>
      <h4>{t("welcome:savedTitle")}</h4>
      <SyDropdown
        options={options}
        className="dropdown"
        placeholder={options.length === 0 ? t("welcome:noSaved") : undefined}
        disabled={options.length === 0 ? true : false}
        onChange={handleOpenSelection}
      />
      <h4>{t("welcome:importTitle")}</h4>
      <SyButton style={{ width: "100%" }} onClick={onClickImport}>
        <SyLucide name="import" />
      </SyButton>
      <IconButton
        name="circle-arrow-left"
        size="2.5rem"
        onClick={onClickBack}
        style={{ marginTop: "2rem" }}
      />
    </div>
  );
}
