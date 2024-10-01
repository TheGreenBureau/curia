import { Case } from "@/types/data/case";
import { Option } from "@/types/data/options";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { format } from "date-fns";

const getCrimeTranslation = (value: string, crimes: Option[]) => {
  return crimes.find((c) => c.value === value)?.label ?? value;
};

type CaseViewProps = {
  currentCase: Case;
  crimes: Option[];
  index: number;
};

export function CaseView({ currentCase, index, crimes }: CaseViewProps) {
  const { t } = useTranslation();

  const prosecutorCount = currentCase.officers.filter(
    (o) => o.type === "prosecutor"
  ).length;
  const plaintiffs = currentCase.civilians.filter(
    (c) => c.type === "plaintiff"
  );

  const styles = StyleSheet.create({
    case: {
      flexDirection: "column",
    },
    basicInfo: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "flex-start",
    },
    serialText: {
      width: "7%",
    },
    timeAndConfidentiality: {
      width: "14%",
      maxWidth: "15%",
      flexDirection: "column",
    },
    confidentialityText: {
      marginTop: 5,
    },
    caseNumbersAndPeople: {
      flexDirection: "column",
      width: "40%",
      maxWidth: "40%",
    },
    caseNumbers: {
      flexDirection: "row",
      maxWidth: "100%",
      flexWrap: "wrap",
    },
    caseNumberText: {
      minWidth: "18%",
      marginRight: 10,
    },
    prosecutors: {
      flexDirection: "column",
      marginTop: 5,
    },
    personText: {
      textTransform: "uppercase",
    },
    defendants: {
      flexDirection: "row",
      maxWidth: "100%",
      flexWrap: "wrap",
    },
    matter: {
      width: "38%",
      maxWidth: "38%",
    },
    notes: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "flex-start",
      marginTop: 10,
      marginBottom: 0,
    },
    notesText: {
      fontStyle: "italic",
      fontSize: 12,
      paddingTop: 5,
    },
  });

  return (
    <View style={styles.case} wrap={false}>
      <View style={styles.basicInfo}>
        <Text style={styles.serialText}>{index + 1}.</Text>
        <View style={styles.timeAndConfidentiality}>
          <Text>{format(currentCase.time, "HH:mm")}</Text>
          {currentCase.confidential && (
            <Text style={styles.confidentialityText}>{t("Salainen")}</Text>
          )}
        </View>
        <View style={styles.caseNumbersAndPeople}>
          <View style={styles.caseNumbers}>
            <Text style={styles.caseNumberText}>{currentCase.caseNumber}</Text>
            {currentCase.type === "criminal" && (
              <Text>{`(${currentCase.prosecutorCaseNumber})`}</Text>
            )}
          </View>
          <View style={styles.prosecutors}>
            {prosecutorCount > 0 && (
              <Text style={styles.personText}>{`${t(
                "strings:Syyttäjä",
                "Syyttäjä",
                { count: prosecutorCount }
              )}/`}</Text>
            )}
            {plaintiffs.length > 0 &&
              plaintiffs.map((plaintiff) => (
                <Text
                  key={plaintiff.id}
                  style={styles.personText}
                >{`${plaintiff.name}/`}</Text>
              ))}
            {currentCase.civilians
              .filter((c) => c.type === "defendant")
              .map((defendant) => (
                <View key={defendant.id} style={styles.defendants}>
                  <Text key={defendant.id} style={styles.personText}>
                    {defendant.name.trim()}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <Text style={styles.matter}>
          {getCrimeTranslation(currentCase.matter, crimes).toUpperCase()}
        </Text>
      </View>

      {currentCase.notePublicity === "public" && currentCase.notes && (
        <View style={styles.notes}>
          <View style={{ width: "7%" }} />
          <View style={{ width: "13%" }} />
          <Text style={styles.notesText}>{currentCase.notes}</Text>
        </View>
      )}
    </View>
  );
}
