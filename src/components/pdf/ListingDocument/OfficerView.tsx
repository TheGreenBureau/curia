import { Officer } from "@/types/data/persons";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, View } from "@react-pdf/renderer";
import { Option } from "@/types/data/options";

export type OfficerCaseNumbers = {
  officer: Officer;
  cases: number[];
};

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

export function OfficerView({
  officerInfo,
  presidingInfo,
  titles,
  title,
  caseCount,
}: OfficerViewProps) {
  const styles = StyleSheet.create({
    officerInfo: {
      marginBottom: 20,
      flexDirection: "row",
      marginTop: 5,
    },
    titleText: {
      width: "25%",
      marginRight: 60,
    },
    officers: {
      flexDirection: "column",
      gap: 10,
    },
    nameTitleAndCases: {
      flexDirection: "column",
    },
    officerTitleText: {
      fontStyle: "italic",
    },
  });

  if (officerInfo.length > 0) {
    return (
      <View style={styles.officerInfo}>
        <Text style={styles.titleText}>{title}</Text>

        <View style={styles.officers}>
          {officerInfo.map((info) => (
            <View key={info.officer.id} style={styles.nameTitleAndCases}>
              <Text>{info.officer.name}</Text>
              {info.officer.title !== "juror" && (
                <Text style={styles.officerTitleText}>
                  {titles.find((title) => title.value === info.officer.title)
                    ?.label ?? info.officer.title}
                </Text>
              )}
              {caseCount > 1 &&
                (info.officer.type === "member" ||
                  info.officer.type === "layman" ||
                  officerInfo.length > 1 ||
                  presidingInfo.length > 1) && <OfficerCaseLine info={info} />}
            </View>
          ))}
        </View>
      </View>
    );
  }

  return null;
}
