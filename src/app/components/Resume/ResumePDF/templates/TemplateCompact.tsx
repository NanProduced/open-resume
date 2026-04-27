import { Page, View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { TemplateProps } from "./types";

export const TemplateCompact = ({
  resume,
  settings,
  themeColor,
  isPDF,
  formTypeToComponent,
  showFormsOrder,
}: TemplateProps) => {
  const { profile } = resume;
  const { fontFamily, fontSize, documentSize } = settings;

  return (
    <Page
      size={documentSize === "A4" ? "A4" : "LETTER"}
      style={{
        ...styles.flexCol,
        color: DEFAULT_FONT_COLOR,
        fontFamily,
        fontSize: fontSize + "pt",
      }}
    >
      <View
        style={{
          ...styles.flexCol,
          padding: `${spacing[4]} ${spacing[12]}`,
        }}
      >
        <View
          style={{
            ...styles.flexRow,
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: spacing[2],
          }}
        >
          <View style={{ ...styles.flexCol, flexGrow: 1 }}>
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
          </View>
        </View>
        {showFormsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
      </View>
    </Page>
  );
};
