import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MenuItem } from "@/components/Pages/Listing/Item/ItemMenu";
import { Trash } from "lucide-react";
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
              {t("strings:Poista asia")} {currentCase.caseNumber}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "strings:Tätä toimintoa ei voi peruuttaa. Valitut kohteet poistetaan pysyvästi. Haluatko varmasti jatkaa?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("strings:Peruuta")}</AlertDialogCancel>
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
            {t("strings:Jatka")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
