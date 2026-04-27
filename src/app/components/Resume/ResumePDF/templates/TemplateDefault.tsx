import { Page, View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { TemplateProps } from "./types";

export const TemplateDefault = ({
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
      {Boolean(settings.themeColor) && (
        <View
          style={{
            width: spacing["full"],
            height: spacing[3.5],
            backgroundColor: themeColor,
          }}
        />
      )}
      <View
        style={{
          ...styles.flexCol,
          padding: `${spacing[0]} ${spacing[20]}`,
        }}
      >
        <ResumePDFProfile
          profile={profile}
          themeColor={themeColor}
          isPDF={isPDF}
        />
        {showFormsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
      </View>
    </Page>
  );
};
