import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  changeTemplate,
  DEFAULT_THEME_COLOR,
  DEFAULT_TEMPLATE,
  selectSettings,
  type GeneralSetting,
  type TemplateType,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import type { FontFamily } from "components/fonts/constants";
import { Cog6ToothIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const TEMPLATE_CONFIGS: {
  type: TemplateType;
  name: string;
  description: string;
}[] = [
  {
    type: "default",
    name: "默认模板",
    description: "经典单栏布局",
  },
  {
    type: "modern",
    name: "现代模板",
    description: "双栏专业布局",
  },
  {
    type: "compact",
    name: "紧凑模板",
    description: "精简空间布局",
  },
];

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize, template } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const currentTemplate = template || DEFAULT_TEMPLATE;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900 ">
            Resume Setting
          </h1>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DocumentDuplicateIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">模板选择</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATE_CONFIGS.map((config) => {
              const isSelected = currentTemplate === config.type;
              return (
                <div
                  key={config.type}
                  className={`
                    cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 relative
                    ${isSelected 
                      ? "border-opacity-100 shadow-md" 
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  style={{
                    borderColor: isSelected ? themeColor : undefined,
                    backgroundColor: isSelected ? `${themeColor}05` : undefined,
                  }}
                  onClick={() => dispatch(changeTemplate(config.type))}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key)) {
                      dispatch(changeTemplate(config.type));
                    }
                  }}
                  tabIndex={0}
                  role="radio"
                  aria-checked={isSelected}
                >
                  {isSelected && (
                    <div 
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: themeColor }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div 
                      className={`
                        w-16 h-20 rounded border mb-2 flex items-center justify-center
                        ${isSelected ? "border-opacity-100" : "border-gray-300"}
                      `}
                      style={{ 
                        borderColor: isSelected ? themeColor : undefined,
                        backgroundColor: isSelected ? `${themeColor}08` : "#f9fafb"
                      }}
                    >
                      {config.type === "default" && (
                        <div className="w-12 h-16 flex flex-col gap-1">
                          <div className="h-2 w-6 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-10 rounded bg-gray-200" />
                          <div className="h-1 w-8 rounded bg-gray-200" />
                          <div className="h-1 w-4 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-10 rounded bg-gray-200" />
                          <div className="h-1 w-9 rounded bg-gray-200" />
                          <div className="h-1 w-10 rounded bg-gray-200" />
                          <div className="h-1 w-4 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-10 rounded bg-gray-200" />
                        </div>
                      )}
                      {config.type === "modern" && (
                        <div className="w-12 h-16 flex gap-1">
                          <div className="w-4 flex flex-col gap-1 pt-1">
                            <div className="h-2 w-3 rounded" style={{ backgroundColor: themeColor }} />
                            <div className="h-1 w-3 rounded bg-gray-300" />
                            <div className="h-1 w-2 rounded bg-gray-300" />
                            <div className="h-1 w-3 rounded" style={{ backgroundColor: themeColor }} />
                            <div className="h-1 w-2 rounded bg-gray-300" />
                            <div className="h-1 w-3 rounded bg-gray-300" />
                          </div>
                          <div className="flex-1 flex flex-col gap-1 pt-1">
                            <div className="h-1 w-5 rounded" style={{ backgroundColor: themeColor }} />
                            <div className="h-1 w-6 rounded bg-gray-200" />
                            <div className="h-1 w-5 rounded bg-gray-200" />
                            <div className="h-1 w-5 rounded bg-gray-200" />
                            <div className="h-1 w-5 rounded" style={{ backgroundColor: themeColor }} />
                            <div className="h-1 w-6 rounded bg-gray-200" />
                          </div>
                        </div>
                      )}
                      {config.type === "compact" && (
                        <div className="w-12 h-16 flex flex-col gap-0.5 pt-1 px-0.5">
                          <div className="h-1.5 w-5 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-0.5 w-10 rounded bg-gray-200" />
                          <div className="h-0.5 w-8 rounded bg-gray-200" />
                          <div className="h-0.5 w-4 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-0.5 w-10 rounded bg-gray-200" />
                          <div className="h-0.5 w-9 rounded bg-gray-200" />
                          <div className="h-0.5 w-10 rounded bg-gray-200" />
                          <div className="h-0.5 w-4 rounded" style={{ backgroundColor: themeColor }} />
                          <div className="h-0.5 w-10 rounded bg-gray-200" />
                          <div className="h-0.5 w-8 rounded bg-gray-200" />
                          <div className="h-0.5 w-9 rounded bg-gray-200" />
                        </div>
                      )}
                    </div>
                    <span 
                      className={`text-xs font-semibold ${
                        isSelected ? "" : "text-gray-600"
                      }`}
                      style={{ color: isSelected ? themeColor : undefined }}
                    >
                      {config.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {config.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <InlineInput
            label="Theme Color"
            name="themeColor"
            value={settings.themeColor}
            placeholder={DEFAULT_THEME_COLOR}
            onChange={handleSettingsChange}
            inputStyle={{ color: themeColor }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {THEME_COLORS.map((color, idx) => (
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                style={{ backgroundColor: color }}
                key={idx}
                onClick={() => handleSettingsChange("themeColor", color)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key))
                    handleSettingsChange("themeColor", color);
                }}
                tabIndex={0}
              >
                {settings.themeColor === color ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>
        <div>
          <InputGroupWrapper label="Font Family" />
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={themeColor}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InlineInput
            label="Font Size (pt)"
            name="fontSize"
            value={fontSize}
            placeholder="11"
            onChange={handleSettingsChange}
          />
          <FontSizeSelections
            fontFamily={fontFamily as FontFamily}
            themeColor={themeColor}
            selectedFontSize={fontSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InputGroupWrapper label="Document Size" />
          <DocumentSizeSelections
            themeColor={themeColor}
            selectedDocumentSize={documentSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
      </div>
    </BaseForm>
  );
};
