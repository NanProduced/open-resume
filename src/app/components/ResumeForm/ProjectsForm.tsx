"use client";
import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";
import { useTranslation } from "lib/i18n";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;
  const { t } = useTranslation();

  return (
    <Form form="projects" addButtonText={t.resumeForm.project.addButton}>
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={t.resumeForm.project.deleteTooltip}
          >
            <Input
              name="project"
              label={t.resumeForm.project.project}
              placeholder={t.resumeForm.project.projectPlaceholder}
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label={t.resumeForm.project.date}
              placeholder={t.resumeForm.project.datePlaceholder}
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <BulletListTextarea
              name="descriptions"
              label={t.resumeForm.project.description}
              placeholder={t.resumeForm.project.descriptionPlaceholder}
              value={descriptions}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
