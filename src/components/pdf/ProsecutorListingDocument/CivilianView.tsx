import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { Civilian } from "@/types/data/persons";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

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

  const styles = StyleSheet.create({
    summonsLine: {
      flexDirection: "row",
      gap: 3,
      fontStyle: "italic",
      fontSize: 10,
    },
    summonsText: {
      color: status.color,
      fontStyle: "normal",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.summonsLine}>
      {summon && (
        <>
          <Text>{summon}</Text>
          <Text>{"=>"}</Text>
        </>
      )}
      <Text style={styles.summonsText}>{status.text}</Text>
    </View>
  );
}

type CivilianViewProps = ProsecutorListingDocumentProps & {
  civilian: Civilian;
};

export function CivilianView(props: CivilianViewProps) {
  const { civilian } = props;

  const { t } = useTranslation();

  const styles = StyleSheet.create({
    civilian: {
      flexDirection: "column",
      maxWidth: 220,
    },
    nameText: {
      flexWrap: "wrap",
    },
    civilianText: {
      fontSize: 10,
      fontStyle: "italic",
    },
  });

  return (
    <View style={styles.civilian}>
      <Text style={styles.nameText}>{civilian.name.trim()}</Text>
      {(civilian.summonsType || civilian.summonsStatus) && (
        <SummonsLine {...props} />
      )}
      {civilian.hasDemands && (
        <Text style={styles.civilianText}>{t("Korvausvaatimus")}</Text>
      )}
      {civilian.counselor && (
        <Text style={styles.civilianText}>
          {`${t("Avustaja")} ${civilian.counselor}`}
        </Text>
      )}
      {civilian.representative && (
        <Text style={styles.civilianText}>
          {`${t("Edustaja")} ${civilian.representative}`}
        </Text>
      )}
      {civilian.trustee && (
        <Text style={styles.civilianText}>
          {`${t("Edunvalvoja")} ${civilian.trustee}`}
        </Text>
      )}
    </View>
  );
}
