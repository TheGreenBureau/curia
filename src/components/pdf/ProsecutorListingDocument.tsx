import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Note,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Case } from "@/types/data/case";
import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import FiraSansRegular from "@/fonts/Fira_Sans/FiraSans-Regular.ttf";
import FiraSansBold from "@/fonts/Fira_Sans/FiraSans-Bold.ttf";
import FiraSansItalic from "@/fonts/Fira_Sans/FiraSans-Italic.ttf";
import {
  Civilian,
  Officer,
  OfficerType,
  officerTypes,
} from "@/types/data/persons";
import { sortCivilians, sortOfficers } from "@/lib/dataFormat";
import { useResolvedLanguage } from "@/hooks/queries";
import { PropsWithChildren, ReactNode } from "react";
import { keys } from "@/lib/utils";

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
  subtitle: {
    textTransform: "uppercase",
    fontSize: 12,
    width: 100,
    maxWidth: 100,
    marginTop: 1,
  },
});

const filterOfficerType = (officers: Officer[], type: OfficerType) => {
  return officers.filter((o) => o.type === type);
};

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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "60%", flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <Text>{t("Juttuluettelo")}</Text>
              <Text>{format(date, "dd.MM.yyyy")}</Text>
            </View>
            <Text>{court.name}</Text>
            {department !== "" && <Text>{department}</Text>}
            <Text>{room}</Text>
            {notes &&
              (notePublicity === "public" ||
                notePublicity === "prosecutor") && (
                <View style={styles.section}>
                  <Text style={{ fontStyle: "italic" }}>{notes}</Text>
                </View>
              )}
          </View>

          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {t("Syyttäjä", "Syyttäjä", { count: prosecutors.length })}
            </Text>
            {prosecutors.map((prosecutor) => (
              <Text key={prosecutor}>{prosecutor}</Text>
            ))}
          </View>
        </View>

        {sharedAssembly && (
          <View style={styles.section}>
            <Assembly
              sortedOfficers={[...cases[0].officers].sort((a, b) =>
                sortOfficers(a, b, lang)
              )}
              {...props}
            />
          </View>
        )}

        <View style={[styles.section, { flexDirection: "column", gap: 40 }]}>
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

type AssemblyProps = ProsecutorListingDocumentProps & {
  sortedOfficers: Officer[];
};

function Assembly(props: AssemblyProps) {
  const { sortedOfficers, ...rest } = props;

  const { t } = useTranslation();

  const sortedCourt = sortedOfficers.filter((o) => o.type !== "prosecutor");

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Text style={styles.subtitle}>{t("Tuomioistuin")}</Text>
      <View
        style={{
          flexDirection: "row",
          rowGap: 5,
          columnGap: 20,
          flexWrap: "wrap",
          maxWidth: 400,
        }}
      >
        {sortedCourt.map((officer) => (
          <OfficerView key={officer.id} officer={officer} {...rest} />
        ))}
      </View>
    </View>
  );
}

type CiviliansProps = ProsecutorListingDocumentProps & {
  civilians: Civilian[];
};

function Civilians(props: PropsWithChildren<CiviliansProps>) {
  const { children, civilians, ...rest } = props;

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Text style={styles.subtitle}>{children}</Text>
      <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
        {civilians.map((civilian) => (
          <CivilianView key={civilian.id} civilian={civilian} {...rest} />
        ))}
      </View>
    </View>
  );
}

type CaseNotesProps = {
  notes: string;
};

function CaseNotes(props: CaseNotesProps) {
  const { notes } = props;

  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Text style={styles.subtitle}>{t("Huomioita")}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          flexWrap: "wrap",
          fontSize: 12,
        }}
      >
        <Text>{notes}</Text>
      </View>
    </View>
  );
}

function People(props: CaseViewProps) {
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

  return nodes.map((node, index) => (
    <>
      {node.node}
      {index < nodes.length - 1 ? (
        <View style={{ borderBottom: 1, marginRight: 10, marginVertical: 5 }} />
      ) : (
        <View style={{ marginBottom: 5 }} />
      )}
    </>
  ));
}

type CaseViewProps = ProsecutorListingDocumentProps & {
  currentCase: Case;
  index: number;
  sharedAssembly: boolean;
  sharedProsecutors: boolean;
};

function CaseView(props: CaseViewProps) {
  const { currentCase, index, crimes, sharedProsecutors } = props;

  const lang = useResolvedLanguage();

  const rollingColors: { bg: string; border: string }[] = [
    {
      bg: "#a855f7",
      border: "#6b21a8",
    },
    {
      bg: "#0ea5e9",
      border: "#075985",
    },
    {
      bg: "#f59e0b",
      border: "#92400e",
    },
    {
      bg: "#14b8a6",
      border: "#115e59",
    },
  ];

  const colorIndex = index <= 3 ? index : (index % 3) - 1;

  return (
    <View
      style={{
        flexDirection: "column",
        paddingBottom: 5,
        gap: 5,
        border: 2,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          marginHorizontal: 10,
          maxWidth: 510,
          gap: 2,
          position: "relative",
        }}
      >
        <View
          style={{
            width: 470,
            position: "absolute",
            top: -30,
            left: 40,
            border: 2,
            borderRadius: 10,
            backgroundColor: "white",
            textAlign: "left",
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 10,
            paddingVertical: 5,
            maxWidth: 470,
            fontSize: 13,
            gap: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", marginLeft: 20 }}>
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
        <View
          style={{
            width: 70,
            height: 31,
            position: "absolute",
            top: -30,
            left: -15,
            border: 2,
            borderRadius: 10,
            backgroundColor: "white",
            textAlign: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            fontStyle: "italic",
            paddingRight: 10,
          }}
        >
          <Text style={{ width: 40, textAlign: "right" }}>
            {format(currentCase.time, "HH:mm")}
          </Text>
        </View>
        <View
          style={{
            width: 35,
            height: 35,
            position: "absolute",
            top: -32,
            left: -28,
            border: 2,
            borderRadius: "50%",
            backgroundColor: "white",
            textAlign: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          <Text>{index + 1}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            maxWidth: 560,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              textTransform: "uppercase",
              maxWidth: 550,
              flexWrap: "wrap",
            }}
          >
            {crimes.find((o) => o.value === currentCase.matter)?.label ??
              currentCase.matter}
          </Text>
        </View>
      </View>
      <View style={{ borderBottom: 1, marginHorizontal: 10 }} />
      <View style={{ flexDirection: "column", marginLeft: 10 }}>
        <People {...props} />
      </View>
    </View>
  );
}

type OfficerViewProps = ProsecutorListingDocumentProps & {
  officer: Officer;
};

function OfficerView(props: OfficerViewProps) {
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

  return (
    <View
      style={{
        flexDirection: "column",
        maxWidth: 220,
      }}
    >
      <Text style={{ flexWrap: "wrap", maxWidth: 220 }}>
        {officer.name.trim()}
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: officer.type === "presiding" ? "bold" : "normal",
            fontSize: 10,
          }}
        >
          {`(${positionAbbreviations[`${officer.type}_abr`] ?? "???"})`}
        </Text>
        <Text style={{ fontStyle: "italic", fontSize: 12 }}>{getTitle()}</Text>
      </View>
    </View>
  );
}

type SummonsLineProps = ProsecutorListingDocumentProps & {
  civilian: Civilian;
};

function SummonsLine({ civilian, summons, summonsStatus }: SummonsLineProps) {
  const getSummon = () => {
    return summons.find((summon) => summon.value === civilian.summonsType)
      ?.label;
  };

  const getStatus = () => {
    const text =
      summonsStatus.find((status) => status.value === civilian.summonsStatus)
        ?.label ?? "???";

    let color: string;

    switch (civilian.summonsStatus) {
      case "failure":
        color = "#e11d48";
        break;
      case "success":
        color = "black";
        break;
      case "fetch":
      case "warrant":
        color = "#f97316";
        break;
      default:
        color = "white";
    }

    return { text, color };
  };

  const summon = getSummon();
  const status = getStatus();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 3,
        fontStyle: "italic",
        fontSize: 10,
      }}
    >
      {summon && (
        <>
          <Text>{summon}</Text>
          <Text>{"=>"}</Text>
        </>
      )}
      <Text
        style={{ color: status.color, fontStyle: "normal", fontWeight: "bold" }}
      >
        {status.text}
      </Text>
    </View>
  );
}

type CivilianViewProps = ProsecutorListingDocumentProps & {
  civilian: Civilian;
};

function CivilianView(props: CivilianViewProps) {
  const { civilian } = props;
  return (
    <View
      style={{
        flexDirection: "column",
        maxWidth: 220,
      }}
    >
      <Text style={{ flexWrap: "wrap" }}>{civilian.name.trim()}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        {(civilian.summonsType || civilian.summonsStatus) && (
          <SummonsLine {...props} />
        )}
      </View>
      {civilian.hasDemands && (
        <Text style={{ fontSize: 10, fontStyle: "italic" }}>
          Korvausvaatimus
        </Text>
      )}
      {civilian.counselor && (
        <Text style={{ fontSize: 10, fontStyle: "italic" }}>
          {`Avustaa ${civilian.counselor}`}
        </Text>
      )}
      {civilian.representative && (
        <Text style={{ fontSize: 10, fontStyle: "italic" }}>
          {`Edustaa ${civilian.representative}`}
        </Text>
      )}
      {civilian.trustee && (
        <Text style={{ fontSize: 10, fontStyle: "italic" }}>
          {`Edunvalvoja ${civilian.trustee}`}
        </Text>
      )}
    </View>
  );
}
