"use client";
import { useState, useCallback } from "react";
import {
  useAppSelector,
  useAppDispatch,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import {
  ShowForm,
  selectFormsOrder,
  changeFormsOrderByDrag,
} from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { cx } from "lib/cx";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const dispatch = useAppDispatch();
  const [isHover, setIsHover] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && index !== draggedIndex) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (targetIndex: number, e: React.DragEvent) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex) {
        return;
      }
      dispatch(
        changeFormsOrderByDrag({
          sourceIndex: draggedIndex,
          targetIndex,
        })
      );
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, dispatch]
  );

  return (
    <div
      className={cx(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <ProfileForm />
        {formsOrder.map((form, index) => {
          const Component = formTypeToComponent[form];
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const showDragIndicator = isDragOver && !isDragging;

          return (
            <div
              key={form}
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(index, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(index, e)}
              className={cx(
                "relative transition-all duration-200",
                isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab",
                showDragIndicator && "border-t-4 border-t-sky-400 pt-2"
              )}
            >
              <Component />
            </div>
          );
        })}
        <ThemeForm />
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
