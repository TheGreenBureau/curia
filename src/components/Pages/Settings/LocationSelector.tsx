import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutateListingsPath } from "@/hooks/mutations";
import { useListingsPath } from "@/hooks/queries";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LocationSelector() {
  const path = useListingsPath();

  const choose = useMutateListingsPath();
  const setToDefault = useMutateListingsPath(true);

  const { t } = useTranslation();

  const ShowPath = () => {
    if (path.isPending || path.isFetching) {
      return <Skeleton className="w-full h-8" />;
    }

    if (path.isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("Virhe")}</AlertTitle>
          <AlertDescription>
            {t("Juttuluetteloiden sijaintia ei voitu noutaa.")}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert>
        <AlertTitle className="uppercase font-dosis">
          {path.data
            ? path.data.isDefault
              ? t("Oletus")
              : t("Muokattu")
            : t("Tuntematon")}
        </AlertTitle>
        <AlertDescription>{path.data?.listingsLocation ?? ""}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <ShowPath />
        <div className="flex flex-row w-full items-center justify-center gap-2">
          <Button className="w-full" onClick={() => choose.mutate()}>
            {t("Valitse sijainti")}
          </Button>
          <Button
            className="w-full"
            onClick={() => setToDefault.mutate()}
            disabled={path.data?.isDefault ?? true}
          >
            {t("Aseta oletussijaintiin")}
          </Button>
        </div>
      </div>
    </div>
  );
}
