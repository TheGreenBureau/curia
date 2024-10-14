import { useResolvedLanguage } from "@/hooks/queries";
import { sortCivilians, sortOfficers } from "@/lib/dataFormat";
import { Case } from "@/types/data/case";
import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Civilians } from "./Civilians";
import { Assembly } from "./Assembly";
import { CaseNotes } from "./CaseNotes";
import { StyleSheet, View } from "@react-pdf/renderer";

export type CaseViewProps = ProsecutorListingDocumentProps & {
  currentCase: Case;
  index: number;
  sharedAssembly: boolean;
  sharedProsecutors: boolean;
};

export function People(props: CaseViewProps) {
  const { currentCase, sharedAssembly } = props;

  const lang = useResolvedLanguage();

  const { t } = useTranslation();

  const sortedOfficers = [...currentCase.officers].sort((a, b) =>
    sortOfficers(a, b, lang)
  );
  const sortedCivilians = [...currentCase.civilians].sort((a, b) =>
    sortCivilians(a, b, lang)
  );

  const defendants = sortedCivilians.filter((c) => c.type === "defendant");
  const injured = sortedCivilians.filter((c) => c.type === "injured");
  const witnesses = sortedCivilians.filter(
    (c) => c.type === "witness" || c.type === "expert"
  );

  const nodes: { id: string; node: ReactNode }[] = [];

  if (defendants.length > 0) {
    nodes.push({
      id: "defendants",
      node: (
        <Civilians civilians={defendants} {...props}>
          {t("Vastaaja", "Vastaajat", { count: defendants.length })}
        </Civilians>
      ),
    });
  }

  if (injured.length > 0) {
    nodes.push({
      id: "injured",
      node: (
        <Civilians civilians={injured} {...props}>
          {t("Asianomistaja", "Asianomistajat", { count: injured.length })}
        </Civilians>
      ),
    });
  }

  if (witnesses.length > 0) {
    nodes.push({
      id: "witnesses",
      node: (
        <Civilians civilians={witnesses} {...props}>
          {t("Todistaja", "Todistajat", { count: witnesses.length })}
        </Civilians>
      ),
    });
  }

  if (sortedOfficers.length > 0 && !sharedAssembly) {
    nodes.push({
      id: "court",
      node: <Assembly sortedOfficers={sortedOfficers} {...props} />,
    });
  }

  if (
    currentCase.notes &&
    (currentCase.notePublicity === "public" ||
      currentCase.notePublicity === "prosecutor")
  ) {
    nodes.push({
      id: "notes",
      node: <CaseNotes notes={currentCase.notes} />,
    });
  }

  const styles = StyleSheet.create({
    separator: {
      borderBottom: 1,
      marginRight: 10,
      marginVertical: 5,
    },
    finalMargin: {
      marginBottom: 5,
    },
  });

  return nodes.map((node, index) => (
    <>
      {node.node}
      {index < nodes.length - 1 ? (
        <View style={styles.separator} />
      ) : (
        <View style={styles.finalMargin} />
      )}
    </>
  ));
}
