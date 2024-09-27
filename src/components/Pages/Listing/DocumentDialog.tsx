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
import {
  ListingDocumentProps,
  ProsecutorListingDocumentProps,
} from "@/types/data/listing";
import { PropsWithChildren } from "react";
import { ProsecutorListingDocument } from "@/components/pdf/ProsecutorListingDocument";

type DocumentDialogProps = ProsecutorListingDocumentProps & {
  prosecutor?: boolean;
};

export function DocumentDialog(props: PropsWithChildren<DocumentDialogProps>) {
  const { children, prosecutor, ...rest } = props;
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline">{t("Esikatselu")}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("Esikatselu")}</DialogTitle>
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
