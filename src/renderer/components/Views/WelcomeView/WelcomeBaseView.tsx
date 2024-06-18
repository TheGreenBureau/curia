import { useTranslation } from "react-i18next";
import { SyButton, SyLucide, SyLink, SyLoader } from "@purplebureau/sy-react";
import { clsx } from "clsx";
import { formattedListingName } from "@common/listings/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";

type WelcomeBaseViewProps = {
  mount: boolean;
  onClickNew: () => void;
  onClickOpen: () => void;
};

export function WelcomeBaseView({
  mount,
  onClickNew,
  onClickOpen,
}: WelcomeBaseViewProps) {
  const queryClient = useQueryClient();

  const {
    data: recents,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.recentListings],
    queryFn: window.api.getRecents,
  });

  const { mutate: openListing } = useMutation({
    mutationFn: window.api.openDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.currentListing],
      });
    },
  });

  const { t } = useTranslation();

  return (
    <div className={clsx("baseview-container", mount && "mount")}>
      <p>{t("welcome:introduction")}</p>
      <div className={"button-container"}>
        <SyButton
          className={"button"}
          style={{ width: "100%" }}
          onClick={onClickNew}
        >
          <div className={"icon-text"}>
            <SyLucide name="square-plus" />
            {t("welcome:createListing")}
          </div>
        </SyButton>
        <SyButton
          className={"button"}
          style={{ width: "100%" }}
          onClick={onClickOpen}
        >
          <div className={"icon-text"}>
            <SyLucide name="folder-open" />
            {t("welcome:openListing")}
          </div>
        </SyButton>
      </div>
      <h4>{t("welcome:recentlyOpened")}</h4>
      {isPending || isFetching ? (
        <SyLoader size="2rem" />
      ) : (
        <>
          {!recents || recents.length === 0 ? (
            <p>{t("welcome:noRecentListings")}</p>
          ) : (
            <div className={"recent-list"}>
              {recents.map((r) => (
                <SyLink key={r.id} onClick={() => openListing(r.id)}>
                  {formattedListingName(r, "day")}
                </SyLink>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
