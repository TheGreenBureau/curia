import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Case } from "@/types/data/case";
import { OfficerType } from "@/types/data/persons";
import { ListingDocumentProps } from "@/types/data/listing";
import FiraSansRegular from "@/fonts/Fira_Sans/FiraSans-Regular.ttf";
import FiraSansBold from "@/fonts/Fira_Sans/FiraSans-Bold.ttf";
import FiraSansItalic from "@/fonts/Fira_Sans/FiraSans-Italic.ttf";
import { CaseView } from "@/components/pdf/ListingDocument/CaseView";
import {
  OfficerCaseNumbers,
  OfficerView,
} from "@/components/pdf/ListingDocument/OfficerView";

Font.register({
  family: "Fira Sans",
  fonts: [
    { src: FiraSansRegular },
    { src: FiraSansBold, fontWeight: "bold" },
    {
      src: FiraSansItalic,
      fontStyle: "italic",
      fontWeight: "normal",
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const commonStyles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
});

const getOfficerCaseNumbers = (cases: Case[], type: OfficerType) => {
  const officerCases: OfficerCaseNumbers[] = [];

  for (let i = 0; i < cases.length; i++) {
    const currentCase = cases[i];
    const currentOfficers = currentCase.officers.filter(
      (officer) => officer.type === type
    );

    for (let officer of currentOfficers) {
      const existingIndex = officerCases.findIndex(
        (existing) => existing.officer.name === officer.name
      );

      if (existingIndex !== -1) {
        officerCases[existingIndex].cases.push(i + 1);
        continue;
      }

      officerCases.push({
        officer: officer,
        cases: [i + 1],
      });
    }
  }

  return officerCases;
};

export const ListingDocument = ({
  court,
  department,
  room,
  date,
  sessionBrake,
  cases,
  courtTitles,
  prosecutorTitles,
  laymanTitles,
  crimes,
  notes,
  notePublicity,
}: ListingDocumentProps) => {
  const { t } = useTranslation();

  const presidingInfo = getOfficerCaseNumbers(cases, "presiding");
  const memberInfo = getOfficerCaseNumbers(cases, "member");
  const laymanInfo = getOfficerCaseNumbers(cases, "layman");
  const prosecutorInfo = getOfficerCaseNumbers(cases, "prosecutor");
  const secretaryInfo = getOfficerCaseNumbers(cases, "secretary");

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      gap: 2,
      fontFamily: "Fira Sans",
      fontSize: 14,
      paddingBottom: 40,
      paddingTop: 40,
      paddingLeft: 40,
      paddingRight: 40,
    },
    generalInfo: {
      ...commonStyles.section,
      flexDirection: "row",
      marginTop: 0,
    },
    courtDetails: {
      flexDirection: "column",
      width: "60%",
      marginRight: 20,
    },
    courtDetailMain: {
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    titleAndDate: {
      flexDirection: "column",
    },
    notes: {
      width: "100%",
      marginBottom: 20,
      marginTop: 0,
    },
    notesText: {
      fontStyle: "italic",
    },
    partDivider: {
      borderTop: 1,
      marginHorizontal: 30,
    },
    break: {
      ...commonStyles.section,
      marginTop: 10,
    },
    breakText: {
      marginHorizontal: 30,
    },
    cases: {
      ...commonStyles.section,
      flexDirection: "column",
      gap: 30,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.generalInfo}>
          <View style={styles.courtDetails}>
            <Text style={styles.courtDetailMain}>{court.name}</Text>
            {department !== "" && <Text>{department}</Text>}
            <Text>{room}</Text>
          </View>
          <View style={styles.titleAndDate}>
            <Text style={styles.courtDetailMain}>{t("Juttuluettelo")}</Text>
            <Text>{format(date, "dd.MM.yyyy")}</Text>
          </View>
        </View>

        {notePublicity === "public" && notes && (
          <View style={styles.notes}>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        <OfficerView
          officerInfo={presidingInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("Oikeuden puheenjohtaja", "Oikeuden puheenjohtaja", {
            count: presidingInfo.length,
          })}
          caseCount={cases.length}
        />

        <OfficerView
          officerInfo={memberInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("Jäsenet")}
          caseCount={cases.length}
        />

        <OfficerView
          officerInfo={laymanInfo}
          presidingInfo={presidingInfo}
          titles={laymanTitles}
          title={t("Lautamiehet")}
          caseCount={cases.length}
        />

        <OfficerView
          officerInfo={prosecutorInfo}
          presidingInfo={presidingInfo}
          titles={prosecutorTitles}
          title={t("Syyttäjä", "Syyttäjä", {
            count: prosecutorInfo.length,
          })}
          caseCount={cases.length}
        />

        <OfficerView
          officerInfo={secretaryInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("Pöytäkirjanpitäjä", "Pöytäkirjanpitäjä", {
            count: secretaryInfo.length,
          })}
          caseCount={cases.length}
        />

        <View style={styles.partDivider} />

        {sessionBrake && (
          <View style={styles.break}>
            <Text style={styles.breakText}>{`${t("Tauko kello")} ${format(
              sessionBrake,
              "HH:mm"
            )}.`}</Text>
          </View>
        )}

        <View style={styles.cases}>
          {cases.map((casu, index) => (
            <CaseView
              key={casu.id}
              currentCase={casu}
              index={index}
              crimes={crimes}
            />
          ))}
        </View>
      </Page>
    </Document>
  );
};
