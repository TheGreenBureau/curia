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
import { Officer, OfficerType } from "@/types/data/persons";
import { Option } from "@/types/data/options";
import { ListingDocumentProps } from "@/types/data/listing";
import FiraSansRegular from "@/fonts/Fira_Sans/FiraSans-Regular.ttf";
import FiraSansBold from "@/fonts/Fira_Sans/FiraSans-Bold.ttf";
import FiraSansItalic from "@/fonts/Fira_Sans/FiraSans-Italic.ttf";

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
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  topTextUpper: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

type OfficerCaseNumbers = {
  officer: Officer;
  cases: number[];
};

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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.section, { flexDirection: "row", marginTop: 0 }]}>
          <View
            style={{ flexDirection: "column", width: "60%", marginRight: 20 }}
          >
            <Text style={styles.topTextUpper}>{court.name}</Text>
            {department.toLowerCase() !== "ei osastoja" &&
              department.toLowerCase() !== "inga avdelningar" && (
                <Text>{department}</Text>
              )}
            <Text>{room}</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.topTextUpper}>{t("Juttuluettelo")}</Text>
            <Text>{format(date, "dd.MM.yyyy")}</Text>
          </View>
        </View>

        {notePublicity === "public" && notes && (
          <View
            style={[
              styles.section,
              { width: "100%", marginBottom: 20, marginTop: 0 },
            ]}
          >
            <Text style={{ fontStyle: "italic" }}>{notes}</Text>
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

        <View style={{ borderTop: 1, marginHorizontal: 30 }} />

        {sessionBrake && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text style={{ marginHorizontal: 30 }}>{`${t(
              "Tauko kello"
            )} ${format(sessionBrake, "HH:mm")}.`}</Text>
          </View>
        )}

        <View style={[styles.section, { flexDirection: "column", gap: 30 }]}>
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

const getCrimeTranslation = (value: string, crimes: Option[]) => {
  return crimes.find((c) => c.value === value)?.label ?? value;
};

type CaseViewProps = {
  currentCase: Case;
  crimes: Option[];
  index: number;
};

function CaseView({ currentCase, index, crimes }: CaseViewProps) {
  const { t } = useTranslation();

  const prosecutorCount = currentCase.officers.filter(
    (o) => o.type === "prosecutor"
  ).length;
  const plaintiffs = currentCase.civilians.filter(
    (c) => c.type === "plaintiff"
  );

  return (
    <View style={[{ flexDirection: "column" }]} wrap={false}>
      <View
        style={{ flexDirection: "row", gap: 10, justifyContent: "flex-start" }}
      >
        <Text style={{ width: "7%" }}>{index + 1}.</Text>
        <View
          style={{ width: "14%", maxWidth: "15%", flexDirection: "column" }}
        >
          <Text>{format(currentCase.time, "HH:mm")}</Text>
          {currentCase.confidential && (
            <Text style={{ marginTop: 5 }}>{t("Salainen")}</Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "column",
            width: "40%",
            maxWidth: "40%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              maxWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            <Text style={{ minWidth: "18%", marginRight: 10 }}>
              {currentCase.caseNumber}
            </Text>
            {currentCase.type === "criminal" && (
              <Text>{`(${currentCase.prosecutorCaseNumber})`}</Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              marginTop: 5,
            }}
          >
            {prosecutorCount > 0 && (
              <Text style={{ textTransform: "uppercase" }}>{`${t(
                "strings:Syyttäjä",
                "Syyttäjä",
                { count: prosecutorCount }
              )}/`}</Text>
            )}
            {plaintiffs.length > 0 &&
              plaintiffs.map((plaintiff) => (
                <Text
                  key={plaintiff.id}
                  style={{ textTransform: "uppercase" }}
                >{`${plaintiff.name}/`}</Text>
              ))}
            {currentCase.civilians
              .filter((c) => c.type === "defendant")
              .map((defendant) => (
                <View
                  key={defendant.id}
                  style={{
                    flexDirection: "row",
                    maxWidth: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    key={defendant.id}
                    style={{ textTransform: "uppercase" }}
                  >
                    {defendant.name.trim()}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <Text style={{ width: "38%", maxWidth: "38%" }}>
          {getCrimeTranslation(currentCase.matter, crimes).toUpperCase()}
        </Text>
      </View>

      {currentCase.notePublicity === "public" && currentCase.notes && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-start",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <View style={{ width: "7%" }} />
          <View style={{ width: "13%" }} />
          <Text style={{ fontStyle: "italic", fontSize: 12, paddingTop: 5 }}>
            {currentCase.notes}
          </Text>
        </View>
      )}
    </View>
  );
}

type OfficerCaseLineProps = {
  info: OfficerCaseNumbers;
};

const OfficerCaseLine = ({ info }: OfficerCaseLineProps) => {
  const { t } = useTranslation();

  const getText = () => {
    return `${t("strings:Asiassa", "Asiassa", {
      count: info.cases.length,
    })} ${info.cases.join(", ")}`;
  };

  return <Text>{getText()}</Text>;
};

type OfficerViewProps = {
  officerInfo: OfficerCaseNumbers[];
  presidingInfo: OfficerCaseNumbers[];
  titles: Option[];
  title: string;
  caseCount: number;
};

function OfficerView({
  officerInfo,
  presidingInfo,
  titles,
  title,
  caseCount,
}: OfficerViewProps) {
  if (officerInfo.length > 0) {
    return (
      <View style={[styles.section, { flexDirection: "column", marginTop: 5 }]}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "25%", marginRight: 60 }}>{title}</Text>

          <View style={{ flexDirection: "column", gap: 10 }}>
            {officerInfo.map((info) => (
              <View key={info.officer.id} style={{ flexDirection: "column" }}>
                <Text>{info.officer.name}</Text>
                {info.officer.title !== "juror" && (
                  <Text style={{ fontStyle: "italic" }}>
                    {titles.find((title) => title.value === info.officer.title)
                      ?.label ?? info.officer.title}
                  </Text>
                )}
                {caseCount > 1 &&
                  (info.officer.type === "member" ||
                    info.officer.type === "layman" ||
                    officerInfo.length > 1 ||
                    presidingInfo.length > 1) && (
                    <OfficerCaseLine info={info} />
                  )}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return null;
}
