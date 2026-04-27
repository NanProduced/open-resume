import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";
import type { SectionLayoutOverride } from "lib/redux/settingsSlice";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  layoutOverride,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  layoutOverride?: SectionLayoutOverride;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      layoutOverride={layoutOverride}
    >
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            {!hideCompanyName && (
              <ResumePDFText bold={true} layoutOverride={layoutOverride}>
                {company}
              </ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <ResumePDFText layoutOverride={layoutOverride}>{jobTitle}</ResumePDFText>
              <ResumePDFText layoutOverride={layoutOverride}>{date}</ResumePDFText>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList items={descriptions} layoutOverride={layoutOverride} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
