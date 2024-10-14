import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { Officer } from "@/types/data/persons";
import { StyleSheet, View, Text } from "@react-pdf/renderer";

type OfficerViewProps = ProsecutorListingDocumentProps & {
  officer: Officer;
};

export function OfficerView(props: OfficerViewProps) {
  const { officer, laymanTitles, courtTitles, positionAbbreviations } = props;

  const getTitle = () => {
    switch (officer.type) {
      case "layman":
        return (
          laymanTitles.find((title) => officer.title === title.value)?.label ??
          officer.title
        );
      default:
        return (
          courtTitles.find((title) => officer.title === title.value)?.label ??
          officer.title
        );
    }
  };

  const styles = StyleSheet.create({
    officer: {
      flexDirection: "column",
      maxWidth: 220,
    },
    officerNameText: {
      flexWrap: "wrap",
      maxWidth: 220,
    },
    positionAndTitle: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
    },
    positionText: {
      fontWeight: officer.type === "presiding" ? "bold" : "normal",
      fontSize: 10,
    },
    titleText: {
      fontStyle: "italic",
      fontSize: 12,
    },
  });

  return (
    <View style={styles.officer}>
      <Text style={styles.officerNameText}>{officer.name.trim()}</Text>
      <View style={styles.positionAndTitle}>
        <Text style={styles.positionText}>
          {`(${positionAbbreviations[`${officer.type}_abr`] ?? "???"})`}
        </Text>
        <Text style={styles.titleText}>{getTitle()}</Text>
      </View>
    </View>
  );
}
