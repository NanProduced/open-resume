import type { ResumeKey } from "lib/redux/types";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import {
  hasChinese,
  hasLetterAndIsAllUpperCase,
  hasOnlyChineseLettersSpaces,
  hasOnlyLettersSpacesAmpersands,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";

export const PROFILE_SECTION: ResumeKey = "profile";

/**
 * Step 3. Group lines into sections
 *
 * Every section (except the profile section) starts with a section title that
 * takes up the entire line. This is a common pattern not just in resumes but
 * also in books and blogs. The resume parser uses this pattern to group lines
 * into the closest section title above these lines.
 */
export const groupLinesIntoSections = (lines: Lines) => {
  let sections: ResumeSectionToLines = {};
  let sectionName: string = PROFILE_SECTION;
  let sectionLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line[0]?.text.trim();
    if (isSectionTitle(line, i)) {
      sections[sectionName] = [...sectionLines];
      sectionName = text;
      sectionLines = [];
    } else {
      sectionLines.push(line);
    }
  }
  if (sectionLines.length > 0) {
    sections[sectionName] = [...sectionLines];
  }
  return sections;
};

const SECTION_TITLE_PRIMARY_KEYWORDS = [
  "experience",
  "education",
  "project",
  "skill",
];
const SECTION_TITLE_SECONDARY_KEYWORDS = [
  "job",
  "course",
  "extracurricular",
  "objective",
  "summary",
  "award",
  "honor",
  "project",
];
const SECTION_TITLE_KEYWORDS = [
  ...SECTION_TITLE_PRIMARY_KEYWORDS,
  ...SECTION_TITLE_SECONDARY_KEYWORDS,
];

const CHINESE_SECTION_TITLE_PRIMARY_KEYWORDS = [
  "工作",
  "经验",
  "经历",
  "教育",
  "背景",
  "项目",
  "技能",
  "专业",
];
const CHINESE_SECTION_TITLE_SECONDARY_KEYWORDS = [
  "个人",
  "信息",
  "简介",
  "介绍",
  "自我评价",
  "获奖",
  "荣誉",
  "证书",
  "培训",
  "课程",
];
const CHINESE_SECTION_TITLE_KEYWORDS = [
  ...CHINESE_SECTION_TITLE_PRIMARY_KEYWORDS,
  ...CHINESE_SECTION_TITLE_SECONDARY_KEYWORDS,
];

const isSectionTitle = (line: Line, lineNumber: number) => {
  const isFirstTwoLines = lineNumber < 2;
  const hasMoreThanOneItemInLine = line.length > 1;
  const hasNoItemInLine = line.length === 0;
  if (isFirstTwoLines || hasMoreThanOneItemInLine || hasNoItemInLine) {
    return false;
  }

  const textItem = line[0];
  const text = textItem.text.trim();

  // For Chinese resumes: bold text with Chinese characters is likely a section title
  if (isBold(textItem) && hasChinese(textItem)) {
    return true;
  }

  // The main heuristic for English resumes: check if the text is both bold and all uppercase
  if (isBold(textItem) && hasLetterAndIsAllUpperCase(textItem)) {
    return true;
  }

  // Fallback heuristic for Chinese: check if it contains Chinese section title keywords
  if (hasChinese(textItem)) {
    if (
      hasOnlyChineseLettersSpaces(textItem) &&
      CHINESE_SECTION_TITLE_KEYWORDS.some((keyword) => text.includes(keyword))
    ) {
      return true;
    }
  }

  // Fallback heuristic for English: check if it includes a keyword match
  const textHasAtMost2Words =
    text.split(" ").filter((s) => s !== "&").length <= 2;
  const startsWithCapitalLetter = /[A-Z]/.test(text.slice(0, 1));

  if (
    textHasAtMost2Words &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    startsWithCapitalLetter &&
    SECTION_TITLE_KEYWORDS.some((keyword) =>
      text.toLowerCase().includes(keyword)
    )
  ) {
    return true;
  }

  return false;
};
