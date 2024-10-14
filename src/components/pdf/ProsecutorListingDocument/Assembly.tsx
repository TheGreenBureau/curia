import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { Officer } from "@/types/data/persons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "@/components/pdf/ProsecutorListingDocument/commonStyles";
import { OfficerView } from "./OfficerView";

type AssemblyProps = ProsecutorListingDocumentProps & {
  sortedOfficers: Officer[];
};

export function Assembly(props: AssemblyProps) {
  const { sortedOfficers, ...rest } = props;

  const { t } = useTranslation();

  const sortedCourt = sortedOfficers.filter((o) => o.type !== "prosecutor");

  const styles = StyleSheet.create({
    assembly: {
      flexDirection: "row",
      gap: 10,
    },
    assemblyTitleText: {
      ...commonStyles.subtitle,
    },
    assemblyOfficers: {
      flexDirection: "row",
      rowGap: 5,
      columnGap: 20,
      flexWrap: "wrap",
      maxWidth: 400,
    },
  });

  return (
    <View style={styles.assembly}>
      <Text style={styles.assemblyTitleText}>{t("Tuomioistuin")}</Text>
      <View style={styles.assemblyOfficers}>
        {sortedCourt.map((officer) => (
          <OfficerView key={officer.id} officer={officer} {...rest} />
        ))}
      </View>
    </View>
  );
}
