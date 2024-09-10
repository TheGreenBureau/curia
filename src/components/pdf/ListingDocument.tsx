import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Court } from "@/types/data/court";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Case } from "@/types/data/case";
import { Officer, OfficerType } from "@/types/data/persons";
import { Option } from "@/types/data/options";

export type ListingDocumentProps = {
  court: Court;
  department: string;
  room: string;
  date: Date;
  sessionBrake?: Date;
  cases: Case[];
  courtTitles: Option[];
  prosecutorTitles: Option[];
  laymanTitles: Option[];
  crimes: Option[];
};

Font.register({
  family: "Fira Sans",
  fonts: [
    { src: "src/fonts/Fira_Sans/FiraSans-Regular.ttf" },
    { src: "src/fonts/Fira_Sans/FiraSans-Bold.ttf", fontWeight: "bold" },
    {
      src: "src/fonts/Fira_Sans/FiraSans-Italic.ttf",
      fontStyle: "italic",
      fontWeight: "normal",
    },
  ],
});

Font.register({
  family: "Open Sans",
  fonts: [
    { src: "src/fonts/Open_Sans/static/OpenSans-Regular.ttf" },
    { src: "src/fonts/Open_Sans/static/OpenSans-Bold.ttf", fontWeight: "bold" },
    {
      src: "src/fonts/Open_Sans/static/OpenSans-Italic.ttf",
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
            style={{ flexDirection: "column", width: "50%", marginRight: 20 }}
          >
            <Text style={styles.topTextUpper}>{court.name}</Text>
            {department.toLowerCase() !== "ei osastoja" &&
              department.toLowerCase() !== "inga avdelningar" && (
                <Text>{department}</Text>
              )}
            <Text>{room}</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.topTextUpper}>
              {t("strings:Juttuluettelo")}
            </Text>
            <Text>{format(date, "dd.MM.yyyy")}</Text>
          </View>
        </View>

        <OfficerView
          officerInfo={presidingInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("strings:Oikeuden puheenjohtaja", "Oikeuden puheenjohtaja", {
            count: presidingInfo.length,
          })}
        />

        <OfficerView
          officerInfo={memberInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("strings:Jäsenet")}
        />

        <OfficerView
          officerInfo={laymanInfo}
          presidingInfo={presidingInfo}
          titles={laymanTitles}
          title={t("strings:Lautamiehet")}
        />

        <OfficerView
          officerInfo={prosecutorInfo}
          presidingInfo={presidingInfo}
          titles={prosecutorTitles}
          title={t("strings:Syyttäjä", "Syyttäjä", {
            count: prosecutorInfo.length,
          })}
        />

        <OfficerView
          officerInfo={secretaryInfo}
          presidingInfo={presidingInfo}
          titles={courtTitles}
          title={t("strings:Pöytäkirjanpitäjä", "Pöytäkirjanpitäjä", {
            count: secretaryInfo.length,
          })}
        />

        {sessionBrake && (
          <View style={styles.section}>
            <Text>{`${t("strings:Tauko kello")} ${format(
              sessionBrake,
              "HH:mm"
            )}`}</Text>
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
            <Text style={{ marginTop: 5 }}>{t("strings:Salainen")}</Text>
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

      <View
        style={{ flexDirection: "row", gap: 10, justifyContent: "flex-start" }}
      >
        <View style={{ width: "7%" }} />
        <View style={{ width: "15%", maxWidth: "15%" }}></View>
      </View>
    </View>
  );
}

type OfficerViewProps = {
  officerInfo: OfficerCaseNumbers[];
  presidingInfo: OfficerCaseNumbers[];
  titles: Option[];
  title: string;
};

function OfficerView({
  officerInfo,
  presidingInfo,
  titles,
  title,
}: OfficerViewProps) {
  const { t } = useTranslation();

  const getOfficerCasesLine = (info: OfficerCaseNumbers) => {
    return `${t("strings:Asiassa", "Asiassa", {
      count: info.cases.length,
    })} ${info.cases.join(", ")}`;
  };

  if (officerInfo.length > 0) {
    return (
      <View style={[styles.section, { flexDirection: "column", marginTop: 5 }]}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "25%", marginRight: 40 }}>{title}</Text>

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
                {(officerInfo.length > 1 || presidingInfo.length > 1) && (
                  <Text>{getOfficerCasesLine(info)}</Text>
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
