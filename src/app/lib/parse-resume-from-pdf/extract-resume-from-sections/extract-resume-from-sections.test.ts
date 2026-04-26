import {
  matchOnlyLetterSpaceOrPeriod,
  matchEmail,
  matchPhone,
  matchUrl,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";
import {
  hasChinese,
  hasOnlyChineseLettersSpaces,
  hasChineseOrLetter,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import type { TextItem } from "lib/parse-resume-from-pdf/types";

const makeTextItem = (text: string) =>
  ({
    text,
  } as TextItem);

describe("extract-profile tests - ", () => {
  it("Name", () => {
    expect(
      matchOnlyLetterSpaceOrPeriod(makeTextItem("Leonardo W. DiCaprio"))![0]
    ).toBe("Leonardo W. DiCaprio");
  });

  it("Email", () => {
    expect(matchEmail(makeTextItem("  hello@open-resume.org  "))![0]).toBe(
      "hello@open-resume.org"
    );
  });

  it("Phone", () => {
    expect(matchPhone(makeTextItem("  (123)456-7890  "))![0]).toBe(
      "(123)456-7890"
    );
  });

  it("Url", () => {
    expect(matchUrl(makeTextItem("  linkedin.com/in/open-resume  "))![0]).toBe(
      "linkedin.com/in/open-resume"
    );
    expect(matchUrl(makeTextItem("hello@open-resume.org"))).toBeFalsy();
  });
});

describe("Chinese text detection tests - ", () => {
  it("hasChinese should return true for Chinese characters", () => {
    expect(hasChinese(makeTextItem("工作经历"))).toBe(true);
    expect(hasChinese(makeTextItem("中文"))).toBe(true);
    expect(hasChinese(makeTextItem("Resume 简历"))).toBe(true);
  });

  it("hasChinese should return false for non-Chinese characters", () => {
    expect(hasChinese(makeTextItem("Work Experience"))).toBe(false);
    expect(hasChinese(makeTextItem("123"))).toBe(false);
    expect(hasChinese(makeTextItem(""))).toBe(false);
  });

  it("hasOnlyChineseLettersSpaces should return true for only Chinese characters, spaces, and special chars", () => {
    expect(hasOnlyChineseLettersSpaces(makeTextItem("工作经历"))).toBe(true);
    expect(hasOnlyChineseLettersSpaces(makeTextItem("工作 经历"))).toBe(true);
    expect(hasOnlyChineseLettersSpaces(makeTextItem("张·三"))).toBe(true);
  });

  it("hasOnlyChineseLettersSpaces should return false for mixed content", () => {
    expect(hasOnlyChineseLettersSpaces(makeTextItem("工作 Work"))).toBe(false);
    expect(hasOnlyChineseLettersSpaces(makeTextItem("工作123"))).toBe(false);
  });

  it("hasChineseOrLetter should return true for Chinese or English letters", () => {
    expect(hasChineseOrLetter(makeTextItem("工作经历"))).toBe(true);
    expect(hasChineseOrLetter(makeTextItem("Work Experience"))).toBe(true);
    expect(hasChineseOrLetter(makeTextItem("工作 Experience"))).toBe(true);
  });

  it("hasChineseOrLetter should return false for non-letter/Chinese content", () => {
    expect(hasChineseOrLetter(makeTextItem("12345"))).toBe(false);
    expect(hasChineseOrLetter(makeTextItem("!!!"))).toBe(false);
  });
});
