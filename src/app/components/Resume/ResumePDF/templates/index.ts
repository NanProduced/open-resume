export { TemplateDefault } from "./TemplateDefault";
export { TemplateModern } from "./TemplateModern";
export { TemplateCompact } from "./TemplateCompact";
export type { TemplateType, TemplateProps, Template } from "./types";

import { TemplateType } from "./types";

export const TEMPLATES: { [key in TemplateType]: { name: string; description: string } } = {
  default: {
    name: "默认模板",
    description: "经典单栏布局，适用于大多数简历场景",
  },
  modern: {
    name: "现代模板",
    description: "双栏布局，左侧展示个人信息和技能，右侧展示工作经历",
  },
  compact: {
    name: "紧凑模板",
    description: "紧凑单栏布局，减少留白，适合内容较多的简历",
  },
};
