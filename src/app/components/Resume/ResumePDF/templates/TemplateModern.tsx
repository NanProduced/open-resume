import { Page, View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { TemplateProps } from "./types";

export const TemplateModern = ({
  resume,
  settings,
  themeColor,
  isPDF,
  formTypeToComponent,
}: TemplateProps) => {
  const { profile, skills } = resume;
  const { fontFamily, fontSize, documentSize, formToHeading, showBulletPoints, formToShow } = settings;

  const sidebarForms = ["skills"] as const;
  const mainContentForms = ["workExperiences", "educations", "projects", "custom"] as const;

  const sidebarVisible = sidebarForms.some((form) => formToShow[form]);
  const mainContentVisible = mainContentForms.some((form) => formToShow[form]);

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
            {formToShow.skills && (
              <ResumePDFSkills
                heading={formToHeading["skills"]}
                skills={skills}
                themeColor={themeColor}
                showBulletPoints={showBulletPoints["skills"]}
              />
            )}
          </View>
        )}

        {mainContentVisible && (
          <View
            style={{
              ...styles.flexCol,
              width: sidebarVisible ? mainWidth : "100%",
            }}
          >
            {mainContentForms.map((form) => {
              if (!formToShow[form]) return null;
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
