import { Page, View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { DEFAULT_FONT_COLOR, type ShowForm } from "lib/redux/settingsSlice";
import type { TemplateProps } from "./types";

const SectionWrapper = ({
  form,
  fineTuneMode,
  isPDF,
  selectedSection,
  onSectionSelect,
  themeColor,
  children,
}: {
  form: ShowForm;
  fineTuneMode?: boolean;
  isPDF: boolean;
  selectedSection?: ShowForm | null;
  onSectionSelect?: (section: ShowForm) => void;
  themeColor: string;
  children: React.ReactNode;
}) => {
  const shouldShowBorder = fineTuneMode && !isPDF;
  const isSelected = selectedSection === form;

  if (!shouldShowBorder) {
    return <>{children}</>;
  }

  return (
    <div
      onClick={() => onSectionSelect?.(form)}
      style={{
        cursor: "pointer",
        border: isSelected ? `2px solid ${themeColor}` : "1px dashed #d1d5db",
        borderRadius: "4px",
        margin: "-1px",
        padding: "1px",
        transition: "all 0.2s ease",
        backgroundColor: isSelected ? `${themeColor}10` : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = themeColor;
          e.currentTarget.style.backgroundColor = `${themeColor}08`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </div>
  );
};

export const TemplateCompact = ({
  resume,
  settings,
  themeColor,
  isPDF,
  formTypeToComponent,
  showFormsOrder,
  fineTuneMode,
  onSectionSelect,
  selectedSection,
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
          return (
            <SectionWrapper
              key={form}
              form={form}
              fineTuneMode={fineTuneMode}
              isPDF={isPDF}
              selectedSection={selectedSection}
              onSectionSelect={onSectionSelect}
              themeColor={themeColor}
            >
              <Component />
            </SectionWrapper>
          );
        })}
      </View>
    </Page>
  );
};
