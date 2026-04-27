import type {
  Resume,
  ResumeProfile,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkills,
  ResumeCustom,
  ItemId,
} from "lib/redux/types";
import type {
  TextDiff,
  ArrayItemDiff,
  SectionDiff,
  ResumeDiff,
  DiffType,
} from "lib/history/types";
import { migrateResumeWithIds } from "lib/redux/resumeSlice";

const generateContentHashId = (obj: any, index: number): string => {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${index}-${Math.abs(hash).toString(36)}`;
};

const getItemStableId = (obj: any, index: number): ItemId => {
  if (obj && typeof obj === "object" && "id" in obj && obj.id) {
    return obj.id;
  }
  return generateContentHashId(obj, index);
};

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && a !== null && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
};

export const diffLines = (oldText: string, newText: string): TextDiff[] => {
  const oldLines = oldText ? oldText.split("\n") : [];
  const newLines = newText ? newText.split("\n") : [];

  const result: TextDiff[] = [];
  const m = oldLines.length;
  const n = newLines.length;

  if (m === 0 && n === 0) return [];

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m;
  let j = n;
  const temp: TextDiff[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      temp.unshift({
        type: "unchanged",
        value: oldLines[i - 1],
        oldIndex: i - 1,
        newIndex: j - 1,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.unshift({
        type: "added",
        value: newLines[j - 1],
        newIndex: j - 1,
      });
      j--;
    } else {
      temp.unshift({
        type: "removed",
        value: oldLines[i - 1],
        oldIndex: i - 1,
      });
      i--;
    }
  }

  return temp;
};

export const diffTextFields = (
  oldObj: Record<string, any>,
  newObj: Record<string, any>
): Record<string, TextDiff[]> => {
  const result: Record<string, TextDiff[]> = {};
  const merged = { ...(oldObj || {}), ...(newObj || {}) };
  const allKeys = Object.keys(merged);

  for (const key of allKeys) {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];

    if (typeof oldVal === "string" || typeof newVal === "string") {
      const diffs = diffLines(oldVal || "", newVal || "");
      if (diffs.some((d) => d.type !== "unchanged")) {
        result[key] = diffs;
      }
    } else if (Array.isArray(oldVal) || Array.isArray(newVal)) {
      const oldStr = (oldVal || []).join("\n");
      const newStr = (newVal || []).join("\n");
      const diffs = diffLines(oldStr, newStr);
      if (diffs.some((d) => d.type !== "unchanged")) {
        result[key] = diffs;
      }
    }
  }

  return result;
};

export const diffArrayItems = <T extends Record<string, any>>(
  oldArray: T[],
  newArray: T[]
): ArrayItemDiff<T>[] => {
  const oldItems = (oldArray || []).map((item, idx) => ({
    id: getItemStableId(item, idx),
    item,
    index: idx,
  }));
  const newItems = (newArray || []).map((item, idx) => ({
    id: getItemStableId(item, idx),
    item,
    index: idx,
  }));

  const oldItemMap: Record<string, any> = {};
  const newItemMap: Record<string, any> = {};
  const allIds: string[] = [];

  for (const item of oldItems) {
    oldItemMap[item.id] = item;
    if (!allIds.includes(item.id)) {
      allIds.push(item.id);
    }
  }
  for (const item of newItems) {
    newItemMap[item.id] = item;
    if (!allIds.includes(item.id)) {
      allIds.push(item.id);
    }
  }

  const result: ArrayItemDiff<T>[] = [];

  for (const id of allIds) {
    const oldItem = oldItemMap[id];
    const newItem = newItemMap[id];

    if (oldItem && !newItem) {
      result.push({
        id,
        type: "removed",
        oldIndex: oldItem.index,
        oldValue: oldItem.item,
      });
    } else if (!oldItem && newItem) {
      result.push({
        id,
        type: "added",
        newIndex: newItem.index,
        newValue: newItem.item,
      });
    } else if (oldItem && newItem) {
      if (deepEqual(oldItem.item, newItem.item)) {
        if (oldItem.index === newItem.index) {
          result.push({
            id,
            type: "unchanged",
            oldIndex: oldItem.index,
            newIndex: newItem.index,
            oldValue: oldItem.item,
            newValue: newItem.item,
          });
        } else {
          result.push({
            id,
            type: "reordered",
            oldIndex: oldItem.index,
            newIndex: newItem.index,
            oldValue: oldItem.item,
            newValue: newItem.item,
          });
        }
      } else {
        const fieldDiffs = diffTextFields(oldItem.item, newItem.item);
        result.push({
          id,
          type: "modified",
          oldIndex: oldItem.index,
          newIndex: newItem.index,
          oldValue: oldItem.item,
          newValue: newItem.item,
          fieldDiffs,
        });
      }
    }
  }

  result.sort((a, b) => {
    const aIdx = a.newIndex ?? a.oldIndex ?? Infinity;
    const bIdx = b.newIndex ?? b.oldIndex ?? Infinity;
    return aIdx - bIdx;
  });

  return result;
};

export const diffProfile = (oldProfile: ResumeProfile, newProfile: ResumeProfile): TextDiff[] => {
  const allFields: (keyof ResumeProfile)[] = [
    "name",
    "email",
    "phone",
    "url",
    "summary",
    "location",
  ];

  const result: TextDiff[] = [];

  for (const field of allFields) {
    const oldVal = oldProfile?.[field] || "";
    const newVal = newProfile?.[field] || "";

    if (oldVal !== newVal) {
      const diffs = diffLines(oldVal, newVal);
      for (const diff of diffs) {
        if (diff.type !== "unchanged") {
          result.push({
            ...diff,
            value: `[${field}] ${diff.value}`,
          });
        }
      }
    }
  }

  return result;
};

export const diffSkills = (
  oldSkills: ResumeSkills,
  newSkills: ResumeSkills
): ArrayItemDiff<any>[] => {
  const result: ArrayItemDiff<any>[] = [];

  const oldDescriptions = oldSkills?.descriptions || [];
  const newDescriptions = newSkills?.descriptions || [];
  const descDiffs = diffArrayItems(
    oldDescriptions.map((d) => ({ text: d })),
    newDescriptions.map((d) => ({ text: d }))
  );

  const oldFeatured = oldSkills?.featuredSkills || [];
  const newFeatured = newSkills?.featuredSkills || [];
  const featuredDiffs = diffArrayItems(oldFeatured, newFeatured);

  result.push(...descDiffs, ...featuredDiffs);

  return result;
};

export const diffResume = (oldResume: Resume, newResume: Resume): SectionDiff[] => {
  const migratedOldResume = migrateResumeWithIds(oldResume);
  const migratedNewResume = migrateResumeWithIds(newResume);

  const sections: SectionDiff[] = [];

  const profileDiff = diffProfile(migratedOldResume.profile, migratedNewResume.profile);
  if (profileDiff.length > 0) {
    sections.push({
      section: "profile",
      type: "text",
      diffs: profileDiff,
    });
  }

  const workExpDiffs = diffArrayItems(
    migratedOldResume.workExperiences,
    migratedNewResume.workExperiences
  );
  if (workExpDiffs.some((d) => d.type !== "unchanged")) {
    sections.push({
      section: "workExperiences",
      type: "array",
      diffs: workExpDiffs,
    });
  }

  const educationDiffs = diffArrayItems(migratedOldResume.educations, migratedNewResume.educations);
  if (educationDiffs.some((d) => d.type !== "unchanged")) {
    sections.push({
      section: "educations",
      type: "array",
      diffs: educationDiffs,
    });
  }

  const projectDiffs = diffArrayItems(migratedOldResume.projects, migratedNewResume.projects);
  if (projectDiffs.some((d) => d.type !== "unchanged")) {
    sections.push({
      section: "projects",
      type: "array",
      diffs: projectDiffs,
    });
  }

  const skillsDiffs = diffSkills(migratedOldResume.skills, migratedNewResume.skills);
  if (skillsDiffs.some((d) => d.type !== "unchanged")) {
    sections.push({
      section: "skills",
      type: "array",
      diffs: skillsDiffs,
    });
  }

  const customDiffs = diffArrayItems(
    (migratedOldResume.custom?.descriptions || []).map((d) => ({ text: d })),
    (migratedNewResume.custom?.descriptions || []).map((d) => ({ text: d }))
  );
  if (customDiffs.some((d) => d.type !== "unchanged")) {
    sections.push({
      section: "custom",
      type: "array",
      diffs: customDiffs,
    });
  }

  return sections;
};

export const hasAnyChanges = (oldResume: Resume, newResume: Resume): boolean => {
  return !deepEqual(oldResume, newResume);
};
