import { TopMenu } from "../../TopMenu";
import { useState } from "react";
import { Listing } from "data/Listing";

type ListingProps = {
  listing: Listing;
  onClickBack: () => void;
};

export function ListingView({ listing, onClickBack }: ListingProps) {
  const [tab, setTab] = useState("cases");

  const handleTabChange = (name: string) => {
    setTab(name);
  };

  return (
    <div>
      <TopMenu
        currentTab={tab}
        onTabClick={handleTabChange}
        onLogoClick={onClickBack}
      />
    </div>
  );
}
