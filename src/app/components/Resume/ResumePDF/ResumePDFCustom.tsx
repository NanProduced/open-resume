import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";
import type { SectionLayoutOverride } from "lib/redux/settingsSlice";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
  layoutOverride,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
  layoutOverride?: SectionLayoutOverride;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      layoutOverride={layoutOverride}
    >
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
          layoutOverride={layoutOverride}
        />
      </View>
    </ResumePDFSection>
  );
};
