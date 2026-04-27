import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
} from "lib/redux/settingsSlice";
import {
  setResumeStore,
  createResume,
  selectCurrentResume,
  updateCurrentResumeData,
  selectResumes,
  initialResumeStoreState,
} from "lib/redux/resumeStoreSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume, Settings, ResumeEntry } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const mergeResumeEntry = (entry: ResumeEntry): ResumeEntry => {
  const mergedResume = deepMerge(
    initialResumeState,
    entry.resume
  ) as Resume;
  const mergedSettings = deepMerge(
    initialSettings,
    entry.settings
  ) as Settings;
  return {
    ...entry,
    resume: mergedResume,
    settings: mergedSettings,
  };
};

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState());
    });
    return unsubscribe;
  }, []);
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();
    if (!state || !state.resumeStore || state.resumeStore.resumes.length === 0) {
      dispatch(
        createResume({
          name: "我的简历",
          resume: initialResumeState,
          settings: initialSettings,
        })
      );
      dispatch(setResume(initialResumeState));
      dispatch(setSettings(initialSettings));
      return;
    }

    const mergedResumes = state.resumeStore.resumes.map(mergeResumeEntry);
    let currentResumeId = state.resumeStore.currentResumeId;
    
    let currentResume = mergedResumes.find((r) => r.id === currentResumeId);
    if (!currentResume && mergedResumes.length > 0) {
      currentResume = mergedResumes[0];
      currentResumeId = currentResume.id;
    }

    dispatch(
      setResumeStore({
        currentResumeId,
        resumes: mergedResumes,
      })
    );

    if (currentResume) {
      dispatch(setResume(currentResume.resume));
      dispatch(setSettings(currentResume.settings));
    }
  }, []);
};

/**
 * Hook to sync resume and settings state to resumeStore when they change
 */
export const useSyncCurrentResumeToStore = () => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => state.resume);
  const settings = useAppSelector((state) => state.settings);
  const resumes = useAppSelector(selectResumes);

  useEffect(() => {
    if (resumes.length > 0) {
      dispatch(updateCurrentResumeData({ resume, settings }));
    }
  }, [resume, settings, resumes.length, dispatch]);
};
