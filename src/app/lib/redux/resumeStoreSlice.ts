import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import type { ResumeEntry, MultiResumeState, Resume, Settings } from "lib/redux/types";

const generateId = () => Math.random().toString(36).substring(2, 11);

const createResumeEntry = (
  name: string,
  resume: Resume = initialResumeState,
  settings: Settings = initialSettings
): ResumeEntry => {
  const now = Date.now();
  return {
    id: generateId(),
    name,
    resume: structuredClone(resume),
    settings: structuredClone(settings),
    createdAt: now,
    updatedAt: now,
  };
};

export const initialResumeStoreState: MultiResumeState = {
  currentResumeId: "",
  resumes: [],
};

export const resumeStoreSlice = createSlice({
  name: "resumeStore",
  initialState: initialResumeStoreState,
  reducers: {
    setResumeStore: (draft, action: PayloadAction<MultiResumeState>) => {
      return action.payload;
    },
    switchResume: (draft, action: PayloadAction<{ resumeId: string }>) => {
      const { resumeId } = action.payload;
      const resume = draft.resumes.find((r) => r.id === resumeId);
      if (resume) {
        draft.currentResumeId = resumeId;
      }
    },
    createResume: (
      draft,
      action: PayloadAction<{ name: string; resume?: Resume; settings?: Settings }>
    ) => {
      const { name, resume, settings } = action.payload;
      const newResume = createResumeEntry(
        name,
        resume || initialResumeState,
        settings || initialSettings
      );
      draft.resumes.push(newResume);
      draft.currentResumeId = newResume.id;
    },
    duplicateResume: (draft, action: PayloadAction<{ resumeId: string }>) => {
      const { resumeId } = action.payload;
      const resumeToDuplicate = draft.resumes.find((r) => r.id === resumeId);
      if (resumeToDuplicate) {
        const now = Date.now();
        const newResume: ResumeEntry = {
          id: generateId(),
          name: `${resumeToDuplicate.name} (Copy)`,
          resume: structuredClone(resumeToDuplicate.resume),
          settings: structuredClone(resumeToDuplicate.settings),
          createdAt: now,
          updatedAt: now,
        };
        draft.resumes.push(newResume);
        draft.currentResumeId = newResume.id;
      }
    },
    deleteResume: (draft, action: PayloadAction<{ resumeId: string }>) => {
      const { resumeId } = action.payload;
      const index = draft.resumes.findIndex((r) => r.id === resumeId);
      if (index !== -1 && draft.resumes.length > 1) {
        draft.resumes.splice(index, 1);
        if (draft.currentResumeId === resumeId) {
          draft.currentResumeId = draft.resumes[0]?.id || "";
        }
      }
    },
    renameResume: (
      draft,
      action: PayloadAction<{ resumeId: string; newName: string }>
    ) => {
      const { resumeId, newName } = action.payload;
      const resume = draft.resumes.find((r) => r.id === resumeId);
      if (resume) {
        resume.name = newName;
        resume.updatedAt = Date.now();
      }
    },
    updateCurrentResumeData: (
      draft,
      action: PayloadAction<{ resume: Resume; settings: Settings }>
    ) => {
      const { resume, settings } = action.payload;
      const currentResume = draft.resumes.find((r) => r.id === draft.currentResumeId);
      if (currentResume) {
        currentResume.resume = structuredClone(resume);
        currentResume.settings = structuredClone(settings);
        currentResume.updatedAt = Date.now();
      }
    },
  },
});

export const {
  setResumeStore,
  switchResume,
  createResume,
  duplicateResume,
  deleteResume,
  renameResume,
  updateCurrentResumeData,
} = resumeStoreSlice.actions;

export const selectResumeStore = (state: RootState) => state.resumeStore;
export const selectCurrentResumeId = (state: RootState) => state.resumeStore.currentResumeId;
export const selectResumes = (state: RootState) => state.resumeStore.resumes;
export const selectCurrentResume = (state: RootState) => {
  const { currentResumeId, resumes } = state.resumeStore;
  return resumes.find((r) => r.id === currentResumeId);
};

export default resumeStoreSlice.reducer;