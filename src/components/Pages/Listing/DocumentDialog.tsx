import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ListingDocument,
  ListingDocumentProps,
} from "@/components/pdf/ListingDocument";
import { useTranslation } from "react-i18next";
import { PDFViewer } from "@react-pdf/renderer";

type DocumentDialogProps = ListingDocumentProps;

export function DocumentDialog(props: DocumentDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("strings:Esikatselu")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("strings:Esikatselu")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-center h-[80vh]">
          <PDFViewer
            showToolbar={false}
            className="w-[50rem] h-full rounded-lg"
          >
            <ListingDocument {...props} />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
