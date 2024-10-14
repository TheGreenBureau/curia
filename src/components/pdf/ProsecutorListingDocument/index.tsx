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
import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import FiraSansRegular from "@/fonts/Fira_Sans/FiraSans-Regular.ttf";
import FiraSansBold from "@/fonts/Fira_Sans/FiraSans-Bold.ttf";
import FiraSansItalic from "@/fonts/Fira_Sans/FiraSans-Italic.ttf";
import FiraSansSemiBold from "@/fonts/Fira_Sans/FiraSans-SemiBold.ttf";
import FiraSansMedium from "@/fonts/Fira_Sans/FiraSans-Medium.ttf";
import { Officer, officerTypes } from "@/types/data/persons";
import { sortOfficers } from "@/lib/dataFormat";
import { useResolvedLanguage } from "@/hooks/queries";
import { Assembly } from "./Assembly";
import { CaseView, filterOfficerType } from "./CaseView";

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
    { src: FiraSansSemiBold, fontWeight: "semibold" },
    { src: FiraSansMedium, fontWeight: "medium" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const officerArraysEqual = (a: Officer[], b: Officer[], lang: string) => {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort((a, b) => sortOfficers(a, b, lang));
  const sortedB = [...b].sort((a, b) => sortOfficers(a, b, lang));

  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i].name !== sortedB[i].name) {
      return false;
    }
  }

  return true;
};

export function ProsecutorListingDocument(
  props: ProsecutorListingDocumentProps
) {
  const { t } = useTranslation();
  const lang = useResolvedLanguage();

  const { cases, court, date, department, room, notes, notePublicity } = props;

  const getProsecutors = () => {
    const prosecutors: string[] = [];

    for (let c of cases) {
      const caseProsecutors = filterOfficerType(c.officers, "prosecutor");

      for (let caseProsecutor of caseProsecutors) {
        if (!prosecutors.includes(caseProsecutor.name)) {
          prosecutors.push(caseProsecutor.name);
        }
      }
    }

    return prosecutors;
  };

  const getHasSharedOfficers = (): { court: boolean; prosecutors: boolean } => {
    if (cases.length === 0)
      return {
        court: false,
        prosecutors: false,
      };

    let court = true;
    let prosecutors = true;

    const officers = officerTypes.reduce<{ [key: string]: Officer[] }>(
      (prev, next) => {
        return {
          ...prev,
          [next]: filterOfficerType(cases[0].officers, next),
        };
      },
      {}
    );

    for (let i = 1; i < cases.length; i++) {
      const current = cases[i];

      for (let key of officerTypes.filter((t) => t !== "prosecutor")) {
        if (
          !officerArraysEqual(
            filterOfficerType(current.officers, key),
            officers[key],
            lang
          )
        ) {
          court = false;
        }
      }

      for (let key of officerTypes.filter((t) => t === "prosecutor")) {
        if (
          !officerArraysEqual(
            filterOfficerType(current.officers, key),
            officers[key],
            lang
          )
        ) {
          prosecutors = false;
        }
      }
    }

    return { court, prosecutors };
  };

  const prosecutors = getProsecutors();
  const hasSharedOfficers = getHasSharedOfficers();
  const sharedAssembly = hasSharedOfficers.court;
  const sharedProsecutors = hasSharedOfficers.prosecutors;

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
    listingInfo: {
      flexDirection: "row",
    },
    courtInfo: {
      width: "60%",
      flexDirection: "column",
    },
    titleAndDate: {
      flexDirection: "row",
      gap: 5,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    prosecutors: {
      flexDirection: "column",
    },
    prosecutorsTitleText: {
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    notes: {
      marginTop: 20,
    },
    notesText: {
      fontStyle: "italic",
    },
    sharedAssembly: {
      marginTop: 20,
    },
    cases: {
      flexDirection: "column",
      gap: 20,
      marginTop: 30,
      marginBottom: 20,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.listingInfo}>
          <View style={styles.courtInfo}>
            <View style={styles.titleAndDate}>
              <Text>{t("Juttuluettelo")}</Text>
              <Text>{format(date, "dd.MM.yyyy")}</Text>
            </View>
            <Text>{court.name}</Text>
            {department !== "" && <Text>{department}</Text>}
            <Text>{room}</Text>
          </View>

          <View style={styles.prosecutors}>
            <Text style={styles.prosecutorsTitleText}>
              {t("Syyttäjä", "Syyttäjä", { count: prosecutors.length })}
            </Text>
            {prosecutors.map((prosecutor) => (
              <Text key={prosecutor}>{prosecutor}</Text>
            ))}
          </View>
        </View>

        {notes &&
          (notePublicity === "public" || notePublicity === "prosecutor") && (
            <View style={styles.notes}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          )}

        {sharedAssembly && (
          <View style={styles.sharedAssembly}>
            <Assembly
              sortedOfficers={[...cases[0].officers].sort((a, b) =>
                sortOfficers(a, b, lang)
              )}
              {...props}
            />
          </View>
        )}

        <View style={styles.cases}>
          {cases.map((current, index) => (
            <CaseView
              key={current.id}
              currentCase={current}
              index={index}
              sharedAssembly={sharedAssembly}
              {...props}
              sharedProsecutors={sharedProsecutors}
            />
          ))}
        </View>
      </Page>
    </Document>
  );
}
