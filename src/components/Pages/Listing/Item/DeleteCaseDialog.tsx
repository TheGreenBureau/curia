import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { Case } from "@/types/data/case";
import { Listing } from "@/types/data/listing";
import { useTranslation } from "react-i18next";
import { produce } from "immer";

type DeleteCaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCase: Case;
  currentListing: Listing;
};

export function DeleteCaseDialog({
  currentCase,
  currentListing,
  open,
  onOpenChange,
}: DeleteCaseDialogProps) {
  const updateListing = useMutateCurrentListing();

  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span>
              {t("Poista asia")} {currentCase.caseNumber}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Peruuta")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updateListing.mutate(
                produce(currentListing, (draft) => {
                  draft.cases = draft.cases.filter(
                    (c) => c.id !== currentCase.id
                  );
                })
              );
            }}
          >
            {t("Jatka")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
