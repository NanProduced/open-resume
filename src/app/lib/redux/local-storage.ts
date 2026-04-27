import type { RootState } from "lib/redux/store";
import type { MultiResumeState, Resume, Settings } from "lib/redux/types";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";

const generateId = () => Math.random().toString(36).substring(2, 11);

interface OldStorageFormat {
  resume?: Resume;
  settings?: Settings;
}

interface NewStorageFormat {
  resumeStore: MultiResumeState;
}

const migrateOldFormat = (oldData: OldStorageFormat): NewStorageFormat => {
  const now = Date.now();
  const resume = oldData.resume || initialResumeState;
  const settings = oldData.settings || initialSettings;

  const defaultResumeEntry = {
    id: generateId(),
    name: "我的简历",
    resume: structuredClone(resume),
    settings: structuredClone(settings),
    createdAt: now,
    updatedAt: now,
  };

  return {
    resumeStore: {
      currentResumeId: defaultResumeEntry.id,
      resumes: [defaultResumeEntry],
    },
  };
};

const isOldFormat = (data: any): data is OldStorageFormat => {
  return data && !("resumeStore" in data) && ("resume" in data || "settings" in data);
};

export const loadStateFromLocalStorage = (): NewStorageFormat | undefined => {
  try {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stringifiedState) return undefined;

    const parsedState = JSON.parse(stringifiedState);

    if (isOldFormat(parsedState)) {
      return migrateOldFormat(parsedState);
    }

    return parsedState as NewStorageFormat;
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const dataToSave: NewStorageFormat = {
      resumeStore: state.resumeStore,
    };
    const stringifiedState = JSON.stringify(dataToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());

export const addNewResumeToStorage = (resume: Resume, settings: Settings, name: string = "导入的简历") => {
  try {
    const existingState = loadStateFromLocalStorage();
    const now = Date.now();

    const newResumeEntry = {
      id: generateId(),
      name,
      resume: structuredClone(resume),
      settings: structuredClone(settings),
      createdAt: now,
      updatedAt: now,
    };

    let newState: NewStorageFormat;
    if (existingState && existingState.resumeStore) {
      newState = {
        resumeStore: {
          currentResumeId: newResumeEntry.id,
          resumes: [...existingState.resumeStore.resumes, newResumeEntry],
        },
      };
    } else {
      newState = {
        resumeStore: {
          currentResumeId: newResumeEntry.id,
          resumes: [newResumeEntry],
        },
      };
    }

    const stringifiedState = JSON.stringify(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};
