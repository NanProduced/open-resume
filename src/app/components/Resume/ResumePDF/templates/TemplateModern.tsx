import { Page, View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { TemplateProps } from "./types";
import type { ShowForm, ColumnType } from "lib/redux/settingsSlice";

const DEFAULT_SIDEBAR_FORM: ShowForm = "skills";

const getFormColumn = (
  form: ShowForm,
  layoutOverrides: { [section: string]: { column?: ColumnType } }
): ColumnType => {
  const column = layoutOverrides[form]?.column;
  if (column) {
    return column;
  }
  return form === DEFAULT_SIDEBAR_FORM ? "sidebar" : "main";
};

export const TemplateModern = ({
  resume,
  settings,
  themeColor,
  isPDF,
  formTypeToComponent,
  showFormsOrder,
}: TemplateProps) => {
  const { profile } = resume;
  const { fontFamily, fontSize, documentSize, formToShow, layoutOverrides } = settings;

  const sidebarFormsOrder = showFormsOrder.filter((form) => 
    formToShow[form] && getFormColumn(form, layoutOverrides) === "sidebar"
  );
  const mainContentFormsOrder = showFormsOrder.filter((form) => 
    formToShow[form] && getFormColumn(form, layoutOverrides) === "main"
  );

  const sidebarVisible = sidebarFormsOrder.length > 0;
  const mainContentVisible = mainContentFormsOrder.length > 0;

  const sidebarWidth = "32%";
  const mainWidth = "65%";

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
          ...styles.flexRow,
          padding: `${spacing[4]} ${spacing[8]}`,
          gap: spacing[8],
        }}
      >
        {sidebarVisible && (
          <View
            style={{
              ...styles.flexCol,
              width: sidebarWidth,
              paddingRight: spacing[4],
              borderRightWidth: "1.5pt",
              borderRightColor: themeColor,
              borderRightStyle: "solid",
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
            {sidebarFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        )}

        {mainContentVisible && (
          <View
            style={{
              ...styles.flexCol,
              width: sidebarVisible ? mainWidth : "100%",
            }}
          >
            {mainContentFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        )}

        {!sidebarVisible && !mainContentVisible && (
          <View style={{ width: "100%", ...styles.flexCol }}>
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
          </View>
        )}
      </View>
    </Page>
  );
};
