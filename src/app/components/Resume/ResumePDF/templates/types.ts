import type { Resume } from "lib/redux/types";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";

export type TemplateType = "default" | "modern" | "compact";

export interface TemplateProps {
  resume: Resume;
  settings: Settings;
  themeColor: string;
  isPDF: boolean;
  formTypeToComponent: { [type in ShowForm]: () => JSX.Element };
  showFormsOrder: ShowForm[];
}

export interface Template {
  type: TemplateType;
  name: string;
  description: string;
}
