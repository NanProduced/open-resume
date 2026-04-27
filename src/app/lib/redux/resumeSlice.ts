import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  ItemId,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

let idCounter = 0;

export const generateItemId = (): ItemId => {
  return `${Date.now()}-${++idCounter}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const createInitialWorkExperience = (): ResumeWorkExperience => ({
  id: generateItemId(),
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
});

export const initialWorkExperience: ResumeWorkExperience =
  createInitialWorkExperience();

export const createInitialEducation = (): ResumeEducation => ({
  id: generateItemId(),
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
});

export const initialEducation: ResumeEducation = createInitialEducation();

export const createInitialProject = (): ResumeProject => ({
  id: generateItemId(),
  project: "",
  date: "",
  descriptions: [],
});

export const initialProject: ResumeProject = createInitialProject();

export const createInitialFeaturedSkill = (): FeaturedSkill => ({
  id: generateItemId(),
  skill: "",
  rating: 4,
});

export const initialFeaturedSkill: FeaturedSkill = createInitialFeaturedSkill();
export const initialFeaturedSkills: FeaturedSkill[] = Array(6)
  .fill(null)
  .map(() => createInitialFeaturedSkill());
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [createInitialWorkExperience()],
  educations: [createInitialEducation()],
  projects: [createInitialProject()],
  skills: {
    featuredSkills: Array(6)
      .fill(null)
      .map(() => createInitialFeaturedSkill()),
    descriptions: [],
  },
  custom: initialCustom,
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, "descriptions">;
      value: string;
    }
  | { field: "descriptions"; value: string[] }
);

export const resumeSlice = createSlice({
  name: "resume",
  initialState: initialResumeState,
  reducers: {
    changeProfile: (
      draft,
      action: PayloadAction<{ field: keyof ResumeProfile; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.profile[field] = value;
    },
    changeWorkExperiences: (
      draft,
      action: PayloadAction<
        CreateChangeActionWithDescriptions<ResumeWorkExperience>
      >
    ) => {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx];
      workExperience[field] = value as any;
    },
    changeEducations: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeEducation>>
    ) => {
      const { idx, field, value } = action.payload;
      const education = draft.educations[idx];
      education[field] = value as any;
    },
    changeProjects: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>
    ) => {
      const { idx, field, value } = action.payload;
      const project = draft.projects[idx];
      project[field] = value as any;
    },
    changeSkills: (
      draft,
      action: PayloadAction<
        | { field: "descriptions"; value: string[] }
        | {
            field: "featuredSkills";
            idx: number;
            skill: string;
            rating: number;
          }
      >
    ) => {
      const { field } = action.payload;
      if (field === "descriptions") {
        const { value } = action.payload;
        draft.skills.descriptions = value;
      } else {
        const { idx, skill, rating } = action.payload;
        const featuredSkill = draft.skills.featuredSkills[idx];
        featuredSkill.skill = skill;
        featuredSkill.rating = rating;
      }
    },
    changeCustom: (
      draft,
      action: PayloadAction<{ field: "descriptions"; value: string[] }>
    ) => {
      const { value } = action.payload;
      draft.custom.descriptions = value;
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences": {
          draft.workExperiences.push(createInitialWorkExperience());
          return draft;
        }
        case "educations": {
          draft.educations.push(createInitialEducation());
          return draft;
        }
        case "projects": {
          draft.projects.push(createInitialProject());
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== "skills" && form !== "custom") {
        if (
          (idx === 0 && direction === "up") ||
          (idx === draft[form].length - 1 && direction === "down")
        ) {
          return draft;
        }

        const section = draft[form][idx];
        if (direction === "up") {
          draft[form][idx] = draft[form][idx - 1];
          draft[form][idx - 1] = section;
        } else {
          draft[form][idx] = draft[form][idx + 1];
          draft[form][idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (
      draft,
      action: PayloadAction<{ form: ShowForm; idx: number }>
    ) => {
      const { form, idx } = action.payload;
      if (form !== "skills" && form !== "custom") {
        draft[form].splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) =>
  state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;

type LegacyResumeWorkExperience = Omit<ResumeWorkExperience, "id"> & {
  id?: ItemId;
};
type LegacyResumeEducation = Omit<ResumeEducation, "id"> & { id?: ItemId };
type LegacyResumeProject = Omit<ResumeProject, "id"> & { id?: ItemId };
type LegacyFeaturedSkill = Omit<FeaturedSkill, "id"> & { id?: ItemId };

interface LegacyResumeSkills extends Omit<ResumeSkills, "featuredSkills"> {
  featuredSkills: LegacyFeaturedSkill[];
}

interface LegacyResume extends Omit<Resume, "workExperiences" | "educations" | "projects" | "skills"> {
  workExperiences: LegacyResumeWorkExperience[];
  educations: LegacyResumeEducation[];
  projects: LegacyResumeProject[];
  skills: LegacyResumeSkills;
}

export const migrateResumeWithIds = (
  legacyResume: LegacyResume | Resume
): Resume => {
  const resume = legacyResume as Resume;

  const migrated: Resume = {
    ...resume,
    profile: { ...resume.profile },
    workExperiences: resume.workExperiences.map((item, index) => ({
      ...item,
      id: item.id || generateItemId(),
    })),
    educations: resume.educations.map((item, index) => ({
      ...item,
      id: item.id || generateItemId(),
    })),
    projects: resume.projects.map((item, index) => ({
      ...item,
      id: item.id || generateItemId(),
    })),
    skills: {
      ...resume.skills,
      featuredSkills: resume.skills.featuredSkills.map((item, index) => ({
        ...item,
        id: item.id || generateItemId(),
      })),
    },
    custom: { ...resume.custom },
  };

  return migrated;
};

export default resumeSlice.reducer;
