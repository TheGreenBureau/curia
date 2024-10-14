import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "./commonStyles";

type CaseNotesProps = {
  notes: string;
};

export function CaseNotes(props: CaseNotesProps) {
  const { notes } = props;

  const { t } = useTranslation();

  const styles = StyleSheet.create({
    notes: {
      flexDirection: "row",
      gap: 10,
    },
    notesTitleText: {
      ...commonStyles.subtitle,
    },
    notesText: {
      flexWrap: "wrap",
      fontSize: 12,
      maxWidth: 400,
    },
  });

  return (
    <View style={styles.notes}>
      <Text style={styles.notesTitleText}>{t("Huomioita")}</Text>
      <Text style={styles.notesText}>{notes}</Text>
    </View>
  );
}
