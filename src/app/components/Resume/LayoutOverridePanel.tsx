"use client";
import { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import {
  selectSettings,
  selectThemeColor,
  changeLayoutOverride,
  resetSectionLayoutOverride,
  resetLayoutOverrides,
  selectLayoutOverrideByForm,
  selectFineTuneMode,
  selectSelectedSection,
  setSelectedSection,
  type ShowForm,
  type SectionLayoutOverride,
  type ColumnType,
} from "lib/redux/settingsSlice";
import { clampColorInRange, isColorInRange, hexToHsl, hslToHex } from "lib/color-utils";
import {
  ArrowsPointingOutIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const SPACING_OPTIONS = [
  { label: "0", value: "0" },
  { label: "3pt (0.5)", value: "1.5pt" },
  { label: "6pt (1)", value: "3pt" },
  { label: "9pt (1.5)", value: "4.5pt" },
  { label: "12pt (2)", value: "6pt" },
  { label: "15pt (2.5)", value: "7.5pt" },
  { label: "18pt (3)", value: "9pt" },
  { label: "24pt (4)", value: "12pt" },
  { label: "30pt (5)", value: "15pt" },
  { label: "36pt (6)", value: "18pt" },
  { label: "48pt (8)", value: "24pt" },
  { label: "60pt (10)", value: "30pt" },
];

const LINE_HEIGHT_OPTIONS = [
  { label: "1.0", value: "1.0" },
  { label: "1.1", value: "1.1" },
  { label: "1.2", value: "1.2" },
  { label: "1.3", value: "1.3" },
  { label: "1.4", value: "1.4" },
  { label: "1.5", value: "1.5" },
  { label: "1.6", value: "1.6" },
  { label: "1.7", value: "1.7" },
  { label: "1.8", value: "1.8" },
  { label: "2.0", value: "2.0" },
];

const FONT_SIZE_OPTIONS = [
  { label: "8pt", value: "8" },
  { label: "9pt", value: "9" },
  { label: "10pt", value: "10" },
  { label: "11pt", value: "11" },
  { label: "12pt", value: "12" },
  { label: "13pt", value: "13" },
  { label: "14pt", value: "14" },
  { label: "15pt", value: "15" },
  { label: "16pt", value: "16" },
];

const COLUMN_OPTIONS: { label: string; value: ColumnType }[] = [
  { label: "Main Column", value: "main" },
  { label: "Sidebar", value: "sidebar" },
];

const SECTION_LABELS: { [key in ShowForm]: string } = {
  workExperiences: "Work Experience",
  educations: "Education",
  projects: "Projects",
  skills: "Skills",
  custom: "Custom",
};

const InputField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = options.find((o) => o.value === value)?.label || placeholder || "Default";

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>{currentLabel}</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 ${
                  value === option.value ? "bg-sky-50 text-sky-700 font-medium" : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ColorPicker = ({
  label,
  value,
  themeColor,
  onChange,
}: {
  label: string;
  value: string | undefined;
  themeColor: string;
  onChange: (value: string) => void;
}) => {
  const [localValue, setLocalValue] = useState(value || themeColor);

  const handleChange = (newColor: string) => {
    setLocalValue(newColor);
    const clampedColor = clampColorInRange(newColor, themeColor, 20);
    onChange(clampedColor);
  };

  const isInRange = value ? isColorInRange(value, themeColor, 20) : true;
  const displayValue = value || themeColor;

  const presetColors = useMemo(() => {
    const [h, s, l] = hexToHsl(themeColor);
    return [
      { label: "Darker", value: hslToHex(h, s, Math.max(0, l - 20)) },
      { label: "Dark", value: hslToHex(h, s, Math.max(0, l - 10)) },
      { label: "Theme", value: themeColor },
      { label: "Light", value: hslToHex(h, s, Math.min(100, l + 10)) },
      { label: "Lighter", value: hslToHex(h, s, Math.min(100, l + 20)) },
    ];
  }, [themeColor]);

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {!isInRange && (
          <span className="ml-1 text-xs text-orange-600">(clamped to ±20% HSL)</span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <div className="flex-1">
          <input
            type="text"
            value={displayValue}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                handleChange(val);
              }
            }}
            className="w-full px-3 py-2 text-sm font-mono bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {presetColors.map((color) => (
          <button
            key={color.label}
            type="button"
            onClick={() => handleChange(color.value)}
            title={color.label}
            className={`w-8 h-8 rounded border-2 ${
              displayValue.toLowerCase() === color.value.toLowerCase()
                ? "border-sky-500 ring-2 ring-sky-200"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  );
};

const SectionSelector = ({
  selectedSection,
  onSelect,
}: {
  selectedSection: ShowForm | null;
  onSelect: (section: ShowForm) => void;
}) => {
  const settings = useAppSelector(selectSettings);
  const { formToShow, formsOrder } = settings;
  const visibleSections = formsOrder.filter((form) => formToShow[form]);

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">Select Section</label>
      <div className="flex flex-wrap gap-1">
        {visibleSections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => onSelect(section)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedSection === section
                ? "bg-sky-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {SECTION_LABELS[section]}
          </button>
        ))}
      </div>
    </div>
  );
};

export const LayoutOverridePanel = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const themeColor = useAppSelector(selectThemeColor);
  const fineTuneMode = useAppSelector(selectFineTuneMode);
  const selectedSection = useAppSelector(selectSelectedSection);

  const layoutOverride = selectedSection
    ? selectLayoutOverrideByForm(selectedSection)({ settings } as any)
    : ({} as SectionLayoutOverride);

  const handleChange = useCallback(
    (field: keyof SectionLayoutOverride, value: string | undefined) => {
      if (!selectedSection) return;
      dispatch(
        changeLayoutOverride({
          section: selectedSection,
          override: { [field]: value },
        })
      );
    },
    [dispatch, selectedSection]
  );

  const handleResetSection = useCallback(() => {
    if (!selectedSection) return;
    dispatch(resetSectionLayoutOverride({ section: selectedSection }));
  }, [dispatch, selectedSection]);

  const handleResetAll = useCallback(() => {
    dispatch(resetLayoutOverrides());
  }, [dispatch]);

  const handleSelectSection = useCallback(
    (section: ShowForm) => {
      dispatch(setSelectedSection(section));
    },
    [dispatch]
  );

  if (!fineTuneMode) {
    return null;
  }

  const hasOverrides = Object.keys(settings.layoutOverrides).length > 0;
  const sectionHasOverrides = selectedSection
    ? Object.keys(settings.layoutOverrides[selectedSection] || {}).length > 0
    : false;

  return (
    <div className="absolute top-0 right-0 w-72 h-full bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowsPointingOutIcon className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-semibold text-gray-900">Layout Fine-Tune</h3>
          </div>
        </div>

        <SectionSelector selectedSection={selectedSection} onSelect={handleSelectSection} />

        {selectedSection && (
          <>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {SECTION_LABELS[selectedSection]} Properties
              </h4>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Margins</label>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Top"
                    value={layoutOverride.marginTop}
                    onChange={(v) => handleChange("marginTop", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                  <InputField
                    label="Bottom"
                    value={layoutOverride.marginBottom}
                    onChange={(v) => handleChange("marginBottom", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Padding</label>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Top"
                    value={layoutOverride.paddingTop}
                    onChange={(v) => handleChange("paddingTop", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                  <InputField
                    label="Bottom"
                    value={layoutOverride.paddingBottom}
                    onChange={(v) => handleChange("paddingBottom", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                  <InputField
                    label="Left"
                    value={layoutOverride.paddingLeft}
                    onChange={(v) => handleChange("paddingLeft", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                  <InputField
                    label="Right"
                    value={layoutOverride.paddingRight}
                    onChange={(v) => handleChange("paddingRight", v)}
                    options={SPACING_OPTIONS}
                    placeholder="Default"
                  />
                </div>
              </div>

              <InputField
                label="Line Height"
                value={layoutOverride.lineHeight}
                onChange={(v) => handleChange("lineHeight", v)}
                options={LINE_HEIGHT_OPTIONS}
                placeholder="Default (1.3)"
              />

              <InputField
                label="Font Size"
                value={layoutOverride.fontSize}
                onChange={(v) => handleChange("fontSize", v)}
                options={FONT_SIZE_OPTIONS}
                placeholder={`Default (${settings.fontSize}pt)`}
              />

              <ColorPicker
                label="Text Color"
                value={layoutOverride.color}
                themeColor={themeColor}
                onChange={(v) => handleChange("color", v)}
              />

              {settings.template === "modern" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Column (Modern Only)</label>
                  <div className="flex gap-2">
                    {COLUMN_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange("column", option.value)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                          layoutOverride.column === option.value
                            ? "bg-sky-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetSection}
                  disabled={!sectionHasOverrides}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Reset Section
                </button>
              </div>
            </div>
          </>
        )}

        {hasOverrides && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <button
              type="button"
              onClick={handleResetAll}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset All Overrides
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
