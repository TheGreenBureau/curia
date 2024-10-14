import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListingDocument } from "@/components/pdf/ListingDocument";
import { useTranslation } from "react-i18next";
import { PDFViewer } from "@react-pdf/renderer";
import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { PropsWithChildren } from "react";
import { ProsecutorListingDocument } from "@/components/pdf/ProsecutorListingDocument";

type DocumentDialogProps = ProsecutorListingDocumentProps & {
  prosecutor?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DocumentDialog(props: DocumentDialogProps) {
  const { prosecutor, open, onOpenChange, ...rest } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{`${t("Esikatselu")} ${
            prosecutor
              ? (
                  t("Syyttäjä", "Syyttäjä", { count: 1 }) as string
                ).toLowerCase()
              : t("Julkinen").toLowerCase()
          }`}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-center h-[80vh]">
          <PDFViewer showToolbar={false} className="w-full h-full rounded-lg ">
            {prosecutor ? (
              <ProsecutorListingDocument {...rest} />
            ) : (
              <ListingDocument {...rest} />
            )}
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
