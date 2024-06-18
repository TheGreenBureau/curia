import { useTranslation } from "react-i18next";
import { SyButton, SyLucide, SyLoader, SyTable } from "@purplebureau/sy-react";
import { clsx } from "clsx";
import { IconButton } from "@components/IconButton";
import { useState } from "react";
import {
  SortDirection,
  TableFilter,
  TableHeaderInfo,
} from "@purplebureau/sy-react/dist/@types/Table";
import { listingsAsRows } from "@common/listings/query";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";

type WelcomeOpenViewProps = {
  onClickBack: () => void;
};

export function WelcomeOpenView({ onClickBack }: WelcomeOpenViewProps) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TableFilter[] | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortingHeader, setSortingHeader] = useState<string | undefined>();

  const queryClient = useQueryClient();

  const { data: fileNameStart } = useQuery({
    queryKey: [QUERY_KEYS.fileNameStart],
    queryFn: window.api.getFilenameDateStart,
  });

  const {
    data: listings,
    isPending: listingsIsPending,
    isFetching: listingsIsFetching,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.listListings,
      limit,
      page,
      filters,
      sortDirection,
      sortingHeader,
      fileNameStart,
    ],
    queryFn: async () =>
      await window.api.getDatabases({
        limit: limit,
        page: page,
        filters: filters,
        fileNameStart: fileNameStart,
        sortDirection: sortDirection,
        sortingHeader: sortingHeader,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: openListing } = useMutation({
    mutationFn: window.api.openDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentListing] });
    },
  });

  const { mutate: importListing, isPending: importIsPending } = useMutation({
    mutationFn: window.api.importDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentListing] });
    },
  });

  const { t } = useTranslation();

  const rows = listingsAsRows(listings?.data ?? [], fileNameStart);

  const headers: TableHeaderInfo[] = [
    {
      id: "court",
      name: t("listings:courtAbbreviationTitle"),
      filter: true,
      sort: true,
    },
    {
      id: "date",
      name: t("listings:dateTitle"),
      filter: true,
      sort: true,
    },
    {
      id: "department",
      name: t("listings:departmentTitle"),
      filter: true,
      sort: true,
    },
    {
      id: "room",
      name: t("listings:roomTitle"),
      filter: true,
      sort: true,
    },
    {
      id: "creation",
      name: t("listings:creationDateTitle"),
      filter: true,
      sort: true,
    },
  ];

  return (
    <div className={clsx("openview-container", "mount")}>
      <p>{t("welcome:openDescription")}</p>
      {listingsIsPending ? (
        <SyLoader size="3rem" />
      ) : (
        <>
          <h4>{t("welcome:savedTitle")}</h4>
          <SyTable
            rows={rows}
            headers={headers}
            pagination={{
              pageCount: listings?.pageCount ?? 0,
              page: page,
              limit: limit,
              pageLabel: t("listings:pageLabel"),
              recordLabel: t("listings:recordLabel"),
            }}
            onUpdate={(info) => {
              setLimit(info?.limit ?? limit);
              setPage(info?.page ?? page);
              setFilters(info?.filters ?? filters);
              setSortDirection(info?.sortDirection ?? sortDirection);
              setSortingHeader(info?.sortingHeaderId ?? sortingHeader);
            }}
            onRowClick={(row) => openListing(row.id)}
            loading={listingsIsFetching}
          />
          <h4>{t("welcome:importTitle")}</h4>
          <SyButton
            style={{ width: "100%" }}
            onClick={() => importListing()}
            loader="outer"
            loading={importIsPending}
          >
            <SyLucide name="import" />
          </SyButton>
          <IconButton
            name="circle-arrow-left"
            size="2.5rem"
            onClick={onClickBack}
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          />
        </>
      )}
    </div>
  );
}
