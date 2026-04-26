import { useState, useEffect, useCallback } from "react";
import { TRANSLATIONS } from "lib/i18n/translations";
import type { Language } from "lib/redux/settingsSlice";
import type { Translation } from "lib/i18n/translations";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  selectLanguage,
  changeLanguage,
  createInitialSettings,
  setSettings,
} from "lib/redux/settingsSlice";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { DEFAULT_LANGUAGE } from "lib/redux/settingsSlice";

const LOCAL_STORAGE_KEY = "open-resume-state";

const getStoredLanguage = (): Language => {
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

const setStoredLanguage = (language: Language) => {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let state = stored ? JSON.parse(stored) : {};
    const settings = createInitialSettings(language);
    state.settings = settings;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
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
    setLanguageState(newLanguage);
    setStoredLanguage(newLanguage);
  }, []);

  const t = isInitialized ? TRANSLATIONS[language] : TRANSLATIONS[DEFAULT_LANGUAGE];

  return { t, language, setLanguage };
};

export const useTranslationWithRedux = (): {
  t: Translation;
  language: Language;
} => {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      dispatch(changeLanguage(newLanguage));
    },
    [dispatch]
  );

  const t = TRANSLATIONS[language];

  return { t, language };
};
