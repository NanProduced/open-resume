import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";
import type { SectionLayoutOverride } from "lib/redux/settingsSlice";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
  layoutOverride,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
  layoutOverride?: SectionLayoutOverride;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      layoutOverride={layoutOverride}
    >
      {educations.map(
        ({ school, degree, date, gpa, descriptions = [] }, idx) => {
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescriptions = descriptions.join() !== "";

          return (
            <View key={idx}>
              {!hideSchoolName && (
                <ResumePDFText bold={true} layoutOverride={layoutOverride}>
                  {school}
                </ResumePDFText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : spacing["1.5"],
                }}
              >
                <ResumePDFText layoutOverride={layoutOverride}>{`${
                  gpa
                    ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
                    : degree
                }`}</ResumePDFText>
                <ResumePDFText layoutOverride={layoutOverride}>{date}</ResumePDFText>
              </View>
              {showDescriptions && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <ResumePDFBulletList
                    items={descriptions}
                    showBulletPoints={showBulletPoints}
                    layoutOverride={layoutOverride}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </ResumePDFSection>
  );
};
