import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";
import type { SectionLayoutOverride } from "lib/redux/settingsSlice";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  layoutOverride,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  layoutOverride?: SectionLayoutOverride;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      layoutOverride={layoutOverride}
    >
      {projects.map(({ project, date, descriptions }, idx) => (
        <View key={idx}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true} layoutOverride={layoutOverride}>
              {project}
            </ResumePDFText>
            <ResumePDFText layoutOverride={layoutOverride}>{date}</ResumePDFText>
          </View>
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            <ResumePDFBulletList items={descriptions} layoutOverride={layoutOverride} />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  );
};
