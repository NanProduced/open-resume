import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR, type ShowForm, type SectionLayoutOverride } from "lib/redux/settingsSlice";

const mergeLayoutOverrideWithStyle = (
  baseStyle: Style,
  override?: SectionLayoutOverride
): Style => {
  if (!override) return baseStyle;

  const result: Style = { ...baseStyle };

  if (override.marginTop) result.marginTop = override.marginTop;
  if (override.marginBottom) result.marginBottom = override.marginBottom;
  if (override.paddingTop) result.paddingTop = override.paddingTop;
  if (override.paddingBottom) result.paddingBottom = override.paddingBottom;
  if (override.paddingLeft) result.paddingLeft = override.paddingLeft;
  if (override.paddingRight) result.paddingRight = override.paddingRight;

  return result;
};

interface ResumePDFSectionProps {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: React.ReactNode;
  sectionType?: ShowForm;
  layoutOverride?: SectionLayoutOverride;
}

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
  sectionType,
  layoutOverride,
}: ResumePDFSectionProps) => {
  const baseStyle = {
    ...styles.flexCol,
    gap: spacing["2"],
    marginTop: spacing["5"],
    ...style,
  };

  const mergedStyle = mergeLayoutOverrideWithStyle(baseStyle, layoutOverride);

  return (
    <View style={mergedStyle}>
      {heading && (
        <View style={{ ...styles.flexRow, alignItems: "center" }}>
          {themeColor && (
            <View
              style={{
                height: "3.75pt",
                width: "30pt",
                backgroundColor: themeColor,
                marginRight: spacing["3.5"],
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            />
          )}
          <Text
            style={{
              fontWeight: "bold",
              letterSpacing: "0.3pt",
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          >
            {heading}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

interface ResumePDFTextProps {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
  layoutOverride?: SectionLayoutOverride;
}

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
  layoutOverride,
}: ResumePDFTextProps) => {
  const mergedStyle: Style = {
    color: layoutOverride?.color || themeColor || DEFAULT_FONT_COLOR,
    fontWeight: bold ? "bold" : "normal",
    ...style,
  };

  if (layoutOverride?.lineHeight) {
    mergedStyle.lineHeight = parseFloat(layoutOverride.lineHeight);
  }

  if (layoutOverride?.fontSize) {
    mergedStyle.fontSize = parseInt(layoutOverride.fontSize) + "pt";
  }

  return (
    <Text style={mergedStyle} debug={DEBUG_RESUME_PDF_FLAG}>
      {children}
    </Text>
  );
};

interface ResumePDFBulletListProps {
  items: string[];
  showBulletPoints?: boolean;
  layoutOverride?: SectionLayoutOverride;
}

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
  layoutOverride,
}: ResumePDFBulletListProps) => {
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow }} key={idx}>
          {showBulletPoints && (
            <ResumePDFText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight: layoutOverride?.lineHeight || "1.3",
              }}
              bold={true}
              layoutOverride={layoutOverride}
            >
              {"•"}
            </ResumePDFText>
          )}
          <ResumePDFText
            style={{
              lineHeight: layoutOverride?.lineHeight || "1.3",
              flexGrow: 1,
              flexBasis: 0,
            }}
            layoutOverride={layoutOverride}
          >
            {item}
          </ResumePDFText>
        </View>
      ))}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

interface ResumeFeaturedSkillProps {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
  layoutOverride?: SectionLayoutOverride;
}

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
  layoutOverride,
}: ResumeFeaturedSkillProps) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }} layoutOverride={layoutOverride}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
