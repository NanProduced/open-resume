import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export type TemplateType = "default" | "modern" | "compact";
export type ColumnType = "sidebar" | "main" | "both";

export interface SectionLayoutOverride {
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  lineHeight?: string;
  fontSize?: string;
  color?: string;
  column?: ColumnType;
}

export interface LayoutOverrides {
  [section: string]: SectionLayoutOverride;
}

export interface Settings {
  template: TemplateType;
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  layoutOverrides: LayoutOverrides;
  fineTuneMode: boolean;
  selectedSection: ShowForm | null;
}

export type ShowForm = keyof Settings["formToShow"];
export type FormWithBulletPoints = keyof Settings["showBulletPoints"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "template" | "formToShow" | "formToHeading" | "formsOrder" | "showBulletPoints" | "layoutOverrides" | "fineTuneMode" | "selectedSection"
>;

export const DEFAULT_THEME_COLOR = "#38bdf8"; // sky-400
export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "11"; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = "#171717"; // text-neutral-800

export const DEFAULT_TEMPLATE: TemplateType = "default";

export const initialSettings: Settings = {
  template: DEFAULT_TEMPLATE,
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "Letter",
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
  layoutOverrides: {},
  fineTuneMode: false,
  selectedSection: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    changeSettings: (
      draft,
      action: PayloadAction<{ field: GeneralSetting; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft[field] = value;
    },
    changeTemplate: (
      draft,
      action: PayloadAction<TemplateType>
    ) => {
      draft.template = action.payload;
    },
    changeShowForm: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: boolean }>
    ) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.formToHeading[field] = value;
    },
    changeFormOrder: (
      draft,
      action: PayloadAction<{ form: ShowForm; type: "up" | "down" }>
    ) => {
      const { form, type } = action.payload;
      const lastIdx = draft.formsOrder.length - 1;
      const pos = draft.formsOrder.indexOf(form);
      const newPos = type === "up" ? pos - 1 : pos + 1;
      const swapFormOrder = (idx1: number, idx2: number) => {
        const temp = draft.formsOrder[idx1];
        draft.formsOrder[idx1] = draft.formsOrder[idx2];
        draft.formsOrder[idx2] = temp;
      };
      if (newPos >= 0 && newPos <= lastIdx) {
        swapFormOrder(pos, newPos);
      }
    },
    changeFormsOrderByDrag: (
      draft,
      action: PayloadAction<{
        sourceIndex: number;
        targetIndex: number;
      }>
    ) => {
      const { sourceIndex, targetIndex } = action.payload;
      const [removed] = draft.formsOrder.splice(sourceIndex, 1);
      draft.formsOrder.splice(targetIndex, 0, removed);
    },
    changeShowBulletPoints: (
      draft,
      action: PayloadAction<{
        field: FormWithBulletPoints;
        value: boolean;
      }>
    ) => {
      const { field, value } = action.payload;
      draft["showBulletPoints"][field] = value;
    },
    changeLayoutOverride: (
      draft,
      action: PayloadAction<{
        section: ShowForm;
        override: Partial<SectionLayoutOverride>;
      }>
    ) => {
      const { section, override } = action.payload;
      if (!draft.layoutOverrides[section]) {
        draft.layoutOverrides[section] = {};
      }
      draft.layoutOverrides[section] = {
        ...draft.layoutOverrides[section],
        ...override,
      };
    },
    resetSectionLayoutOverride: (
      draft,
      action: PayloadAction<{ section: ShowForm }>
    ) => {
      const { section } = action.payload;
      if (draft.layoutOverrides[section]) {
        delete draft.layoutOverrides[section];
      }
    },
    resetLayoutOverrides: (draft) => {
      draft.layoutOverrides = {};
    },
    toggleFineTuneMode: (draft) => {
      draft.fineTuneMode = !draft.fineTuneMode;
      if (!draft.fineTuneMode) {
        draft.selectedSection = null;
      }
    },
    setFineTuneMode: (draft, action: PayloadAction<boolean>) => {
      draft.fineTuneMode = action.payload;
      if (!action.payload) {
        draft.selectedSection = null;
      }
    },
    setSelectedSection: (draft, action: PayloadAction<ShowForm | null>) => {
      draft.selectedSection = action.payload;
    },
    setSettings: (draft, action: PayloadAction<Settings>) => {
      return action.payload;
    },
  },
});

export const {
  changeSettings,
  changeTemplate,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeFormsOrderByDrag,
  changeShowBulletPoints,
  changeLayoutOverride,
  resetSectionLayoutOverride,
  resetLayoutOverrides,
  toggleFineTuneMode,
  setFineTuneMode,
  setSelectedSection,
  setSettings,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectTemplate = (state: RootState) => state.settings.template;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;

export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToShow[form];

export const selectFormToHeading = (state: RootState) =>
  state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToHeading[form];

export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

export const selectShowBulletPoints =
  (form: FormWithBulletPoints) => (state: RootState) =>
    state.settings.showBulletPoints[form];

export const selectLayoutOverrides = (state: RootState) =>
  state.settings.layoutOverrides;
export const selectLayoutOverrideByForm =
  (form: ShowForm) => (state: RootState) =>
    state.settings.layoutOverrides[form] || {};

export const selectFineTuneMode = (state: RootState) => state.settings.fineTuneMode;
export const selectSelectedSection = (state: RootState) => state.settings.selectedSection;

export default settingsSlice.reducer;
