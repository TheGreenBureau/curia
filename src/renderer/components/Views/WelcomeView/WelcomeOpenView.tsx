import { useTranslation } from "react-i18next";
import {
  SyButton,
  SyLucide,
  SyLoader,
  SyTable,
  SyCallout,
} from "@purplebureau/sy-react";
import { clsx } from "clsx";
import { IconButton } from "@components/IconButton";
import { PropsWithChildren, useState } from "react";
import {
  SortDirection,
  TableFilter,
} from "@purplebureau/sy-react/dist/@types/Table";
import { listingsAsRows } from "@common/listings/query";
import {
  QueryClient,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@common/queryKeys";
import { ListingHeaders } from "data/Listing";

type WelcomeOpenViewProps = {
  onClickBack: () => void;
};

export function WelcomeOpenView({ onClickBack }: WelcomeOpenViewProps) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<
    TableFilter<ListingHeaders>[] | undefined
  >();
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortingHeader, setSortingHeader] = useState<
    keyof ListingHeaders | undefined
  >();

  const queryClient = useQueryClient();

  const { data: fileNameStart } = useQuery({
    queryKey: [QUERY_KEYS.fileNameStart],
    queryFn: window.api.getFilenameDateStart,
  });

  const {
    data: listings,
    isPending: listingsIsPending,
    isFetching: listingsIsFetching,
    isError: listingsIsError,
    isSuccess: listingsIsSuccess,
    error: listingsError,
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

  const { t } = useTranslation();

  const headers: ListingHeaders = {
    court: {
      name: t("listings:courtAbbreviationTitle"),
      filter: true,
      sort: true,
    },
    date: {
      name: t("listings:dateTitle"),
      filter: true,
      sort: true,
    },
    department: {
      name: t("listings:departmentTitle"),
      filter: true,
      sort: true,
    },
    room: {
      name: t("listings:roomTitle"),
      filter: true,
      sort: true,
    },
    creation: {
      name: t("listings:creationDateTitle"),
      filter: true,
      sort: true,
    },
  };

  const rows = listingsAsRows(listings?.data ?? [], fileNameStart);

  if (listingsIsPending) {
    return (
      <OpenListingFrame
        description={t("welcome:openDescription")}
        onClickBack={onClickBack}
      >
        <SyLoader visible size="3rem" />
      </OpenListingFrame>
    );
  }

  if (listingsIsError) {
    return (
      <OpenListingFrame
        description={t("welcome:openDescription")}
        onClickBack={onClickBack}
      >
        <OpenListingContent title={t("listings:fetchFailed")}>
          <SyCallout type="warning" title={t("listings:failReason")}>
            {listingsError.message}
          </SyCallout>
          <ImportButton
            queryClient={queryClient}
            title={t("welcome:importTitle")}
          />
        </OpenListingContent>
      </OpenListingFrame>
    );
  }

  if (listingsIsSuccess && listings.noListingsInDirectory) {
    return (
      <OpenListingFrame
        description={t("welcome:openDescription")}
        onClickBack={onClickBack}
      >
        <OpenListingContent title={t("welcome:savedTitle")}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SyLucide name="frown" />
            {t("listings:noListings")}
          </div>
          <ImportButton
            queryClient={queryClient}
            title={t("welcome:importTitle")}
          />
        </OpenListingContent>
      </OpenListingFrame>
    );
  }

  return (
    <OpenListingFrame
      description={t("welcome:openDescription")}
      onClickBack={onClickBack}
    >
      <OpenListingContent title={t("welcome:savedTitle")}>
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
        <ImportButton
          queryClient={queryClient}
          title={t("welcome:importTitle")}
        />
      </OpenListingContent>
    </OpenListingFrame>
  );
}

type OpenListingContentProps = {
  title: string;
};
function OpenListingContent({
  children,
  title,
}: PropsWithChildren<OpenListingContentProps>) {
  return (
    <>
      <h4>{title}</h4>
      {children}
    </>
  );
}

type OpenListingFrameProps = {
  description: string;
  onClickBack: () => void;
};
function OpenListingFrame({
  children,
  description,
  onClickBack,
}: PropsWithChildren<OpenListingFrameProps>) {
  return (
    <div className={clsx("openview-container", "mount")}>
      <p>{description}</p>
      {children}
      <IconButton
        name="circle-arrow-left"
        size="2.5rem"
        onClick={onClickBack}
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      />
    </div>
  );
}

type ImportButtonProps = {
  queryClient: QueryClient;
  title: string;
};
function ImportButton({ queryClient, title }: ImportButtonProps) {
  const { mutate: importListing, isPending: importIsPending } = useMutation({
    mutationFn: window.api.importDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentListing] });
    },
  });

  return (
    <>
      <h4>{title}</h4>
      <SyButton
        style={{ width: "100%" }}
        onClick={() => importListing()}
        loader="outer"
        loading={importIsPending}
      >
        <SyLucide name="import" />
      </SyButton>
    </>
  );
}
