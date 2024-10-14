import { ProsecutorListingDocumentProps } from "@/types/data/listing";
import { Civilian } from "@/types/data/persons";
import { PropsWithChildren } from "react";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "./commonStyles";
import { CivilianView } from "./CivilianView";

type CiviliansProps = ProsecutorListingDocumentProps & {
  civilians: Civilian[];
};

export function Civilians(props: PropsWithChildren<CiviliansProps>) {
  const { children, civilians, ...rest } = props;

  const styles = StyleSheet.create({
    civilians: {
      flexDirection: "row",
      gap: 10,
    },
    civiliansTitleText: {
      ...commonStyles.subtitle,
    },
    civiliansList: {
      flexDirection: "row",
      gap: 20,
      flexWrap: "wrap",
    },
  });

  return (
    <View style={styles.civilians}>
      <Text style={styles.civiliansTitleText}>{children}</Text>
      <View style={styles.civiliansList}>
        {civilians.map((civilian) => (
          <CivilianView key={civilian.id} civilian={civilian} {...rest} />
        ))}
      </View>
    </View>
  );
}
