import { TopMenu } from "@components/TopMenu";
import { useState } from "react";

export function ListingView() {
  const [tab, setTab] = useState("cases");

  const handleTabChange = (name: string) => {
    setTab(name);
  };

  return (
    <div>
      <TopMenu currentTab={tab} onTabClick={handleTabChange} />
    </div>
  );
}
