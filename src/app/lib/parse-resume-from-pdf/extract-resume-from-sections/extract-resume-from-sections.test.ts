import {
  matchOnlyLetterSpaceOrPeriod,
  matchEmail,
  matchPhone,
  matchUrl,
  matchChineseName,
  matchChinesePhone,
  matchChineseLocation,
  matchName,
  matchAnyPhone,
  matchAnyLocation,
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

describe("Chinese personal info extraction tests - ", () => {
  describe("Chinese name extraction - ", () => {
    it("matchChineseName should match 2-4 Chinese characters", () => {
      expect(matchChineseName(makeTextItem("张三"))![0]).toBe("张三");
      expect(matchChineseName(makeTextItem("张三丰"))![0]).toBe("张三丰");
      expect(matchChineseName(makeTextItem("欧阳铁柱"))![0]).toBe("欧阳铁柱");
    });

    it("matchChineseName should not match invalid names", () => {
      expect(matchChineseName(makeTextItem("张"))).toBeFalsy();
      expect(matchChineseName(makeTextItem("欧阳铁柱长"))).toBeFalsy();
      expect(matchChineseName(makeTextItem("张三123"))).toBeFalsy();
      expect(matchChineseName(makeTextItem("Zhang San"))).toBeFalsy();
    });

    it("matchName should match both English and Chinese names", () => {
      expect(matchName(makeTextItem("Leonardo DiCaprio"))![0]).toBe("Leonardo DiCaprio");
      expect(matchName(makeTextItem("张三"))![0]).toBe("张三");
    });
  });

  describe("Chinese phone extraction - ", () => {
    it("matchChinesePhone should match Chinese phone numbers", () => {
      expect(matchChinesePhone(makeTextItem("13800138000"))![0]).toBe("13800138000");
      expect(matchChinesePhone(makeTextItem("138-0013-8000"))![0]).toBe("138-0013-8000");
      expect(matchChinesePhone(makeTextItem("138 0013 8000"))![0]).toBe("138 0013 8000");
    });

    it("matchAnyPhone should match both English and Chinese phones", () => {
      expect(matchAnyPhone(makeTextItem("(123)456-7890"))![0]).toBe("(123)456-7890");
      expect(matchAnyPhone(makeTextItem("13800138000"))![0]).toBe("13800138000");
    });
  });

  describe("Chinese location extraction - ", () => {
    it("matchChineseLocation should match Chinese locations", () => {
      expect(matchChineseLocation(makeTextItem("北京市"))![0]).toBe("北京市");
      expect(matchChineseLocation(makeTextItem("上海市浦东新区"))![0]).toBe("上海市浦东新区");
      expect(matchChineseLocation(makeTextItem("广东省深圳市"))![0]).toBe("广东省深圳市");
      expect(matchChineseLocation(makeTextItem("朝阳区"))![0]).toBe("朝阳区");
    });

    it("matchAnyLocation should match both English and Chinese locations", () => {
      expect(matchAnyLocation(makeTextItem("New York, NY"))![0]).toBe("New York, NY");
      expect(matchAnyLocation(makeTextItem("北京市"))![0]).toBe("北京市");
    });
  });
});
