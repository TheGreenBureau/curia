import { useResolvedLanguage } from "@/hooks/queries";
import { CaseViewProps, People } from "./People";
import {
  StyleSheet,
  View,
  Text,
  Svg,
  Circle,
  Polyline,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Officer, OfficerType } from "@/types/data/persons";
import { sortOfficers } from "@/lib/dataFormat";

export const filterOfficerType = (officers: Officer[], type: OfficerType) => {
  return officers.filter((o) => o.type === type);
};

export function CaseView(props: CaseViewProps) {
  const { currentCase, index, crimes, sharedProsecutors } = props;

  const lang = useResolvedLanguage();

  const styles = StyleSheet.create({
    caseView: {
      flexDirection: "column",
      paddingBottom: 5,
      gap: 5,
      border: 1,
      borderTop: 5,
      borderRadius: 5,
    },
    caseInfo: {
      flexDirection: "column",
      marginHorizontal: 10,
      maxWidth: 510,
      gap: 5,
      position: "relative",
    },
    serialAndMatter: {
      flexDirection: "row",
      maxWidth: 560,
      marginTop: 10,
      fontWeight: "medium",
    },
    serialText: {
      width: 20,
    },
    matterText: {
      textTransform: "uppercase",
      fontWeight: "medium",
      maxWidth: 450,
      flexWrap: "wrap",
    },
    timeAndCaseNumbers: {
      flexDirection: "row",
      maxWidth: 560,
      gap: 10,
      alignItems: "center",
      marginTop: 5,
    },
    time: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    timeText: {
      fontWeight: "medium",
    },
    prosecutorCaseNumberText: {
      fontWeight: "medium",
    },
    separator: {
      borderBottom: 1,
      marginHorizontal: 10,
    },
    people: {
      flexDirection: "column",
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.caseView} wrap={false}>
      <View style={styles.caseInfo}>
        <View style={styles.serialAndMatter}>
          <Text style={styles.serialText}>{index + 1}.</Text>
          <Text style={styles.matterText}>
            {crimes.find((o) => o.value === currentCase.matter)?.label ??
              currentCase.matter}
          </Text>
        </View>
        <View style={styles.timeAndCaseNumbers}>
          <View style={styles.time}>
            <Svg
              style={{ marginTop: 1 }}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <Circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
              <Polyline points="12 6 12 12 16 14" fill="none" strokeWidth="2" />
            </Svg>
            <Text style={styles.timeText}>
              {format(currentCase.time, "HH:mm")}
            </Text>
          </View>
          <Text>|</Text>
          <Text style={styles.prosecutorCaseNumberText}>
            {currentCase.prosecutorCaseNumber}
          </Text>
          <Text>|</Text>
          <Text>{currentCase.caseNumber}</Text>
          {!sharedProsecutors && (
            <>
              <Text>|</Text>
              {filterOfficerType(currentCase.officers, "prosecutor")
                .sort((a, b) => sortOfficers(a, b, lang))
                .map((prosecutor) => (
                  <Text>{prosecutor.name}</Text>
                ))}
            </>
          )}
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.people}>
        <People {...props} />
      </View>
    </View>
  );
}
