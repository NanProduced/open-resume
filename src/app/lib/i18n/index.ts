import { useState, useEffect, useCallback } from "react";
import { TRANSLATIONS } from "lib/i18n/translations";
import type { Language } from "lib/redux/settingsSlice";
import type { Translation } from "lib/i18n/translations";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_FAMILY_ZH,
  CHINESE_FORM_HEADINGS,
  ENGLISH_FORM_HEADINGS,
  changeLanguage,
} from "lib/redux/settingsSlice";
import { store } from "lib/redux/store";
import { loadStateFromLocalStorage, saveStateToLocalStorage } from "lib/redux/local-storage";
import type { Settings } from "lib/redux/settingsSlice";

const LOCAL_STORAGE_KEY = "open-resume-state";

export const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.settings && parsed.settings.language) {
        return parsed.settings.language;
      }
    }
  } catch (e) {
    // Ignore
  }
  return DEFAULT_LANGUAGE;
};

export const updateStoredLanguage = (language: Language) => {
  if (typeof window === "undefined") return;
  try {
    const stored = loadStateFromLocalStorage();
    const state = stored || {};
    const currentSettings: Settings | undefined = state.settings;
    
    const defaultFontFamily = language === "zh" ? DEFAULT_FONT_FAMILY_ZH : DEFAULT_FONT_FAMILY;
    const defaultFormToHeading = language === "zh"
      ? { ...CHINESE_FORM_HEADINGS }
      : { ...ENGLISH_FORM_HEADINGS };

    const newSettings: Settings = {
      ...currentSettings,
      language,
      fontFamily: currentSettings?.fontFamily && currentSettings.fontFamily !== DEFAULT_FONT_FAMILY && currentSettings.fontFamily !== DEFAULT_FONT_FAMILY_ZH
        ? currentSettings.fontFamily
        : defaultFontFamily,
      formToHeading: {
        ...currentSettings?.formToHeading,
        ...defaultFormToHeading,
      },
    } as Settings;

    const newState = {
      ...state,
      settings: newSettings,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    // Ignore
  }
};

export const useTranslation = (): {
  t: Translation;
  language: Language;
  setLanguage: (lang: Language) => void;
} => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setLanguageState(storedLanguage);
    setIsInitialized(true);
  }, []);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setLanguageState(newLanguage);
    updateStoredLanguage(newLanguage);
    
    try {
      store.dispatch(changeLanguage(newLanguage));
    } catch (e) {
      // Ignore if Redux is not initialized (e.g., on static pages)
    }
  }, [language]);

  const t = isInitialized ? TRANSLATIONS[language] : TRANSLATIONS[DEFAULT_LANGUAGE];

  return { t, language, setLanguage };
};
